use std::env;

use ::entities::{prelude::*, *};
use cloudinary::upload::Upload;
use sea_orm::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::types::{chrono::Utc, Uuid};

pub struct Chapters;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, FromQueryResult)]
struct ChapterPrice {
    price: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ChapterDetails {
    chapter: Option<chapter::Model>,
    course_price: Option<ChapterPrice>,
    attachments: Option<Vec<attachment::Model>>,
    next_chapter: Option<chapter::Model>,
    user_progress: Option<user_progress::Model>,
    purchase: Option<purchase::Model>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ReorderData {
    id: String,
    position: i32,
}

impl Chapters {
    pub async fn get(
        db: &DbConn,
        user_id: String,
        course_id: String,
        chapter_id: String,
    ) -> Result<ChapterDetails, DbErr> {
        println!("1");
        let purchase = purchase::Entity::find()
            .filter(purchase::Column::UserId.eq(user_id.clone())) // Filter by userId
            .filter(purchase::Column::CourseId.eq(course_id.clone())) // Filter by courseId
            .one(db) // Retrieve one record
            .await?;
        println!("2");
        let course_price = Course::find_by_id(course_id.clone())
            .filter(course::Column::IsPublished.eq(true))
            .select_only()
            .column(course::Column::Price)
            .into_model::<ChapterPrice>()
            .one(db)
            .await?;
        println!("3");
        let chapter = Chapter::find_by_id(chapter_id.clone())
            .filter(chapter::Column::IsPublished.eq(true))
            .one(db)
            .await?;
        println!("4");
        if chapter.is_none() || course_price.is_none() {
            return Err(DbErr::Custom("Chapter or course not found".into()));
        }
        println!("5");
        let chapter = chapter.unwrap();
        println!("6");
        let mut attachments: Option<Vec<attachment::Model>> = Some(Vec::new());
        let mut next_chapter: Option<chapter::Model> = None;

        if purchase.is_some() {
            attachments = Some(
                Attachment::find()
                    .filter(attachment::Column::CourseId.eq(course_id.clone()))
                    .all(db)
                    .await?,
            );
        }
        println!("7");
        if chapter.is_free || purchase.is_some() {
            next_chapter = Chapter::find()
                .filter(chapter::Column::CourseId.eq(course_id.clone()))
                .filter(chapter::Column::IsPublished.eq(true))
                .filter(chapter::Column::Position.gt(chapter.position))
                .order_by_asc(chapter::Column::Position)
                .one(db)
                .await?;
        }
        println!("8");
        let user_progress = UserProgress::find()
            .filter(user_progress::Column::ChapterId.eq(chapter_id.clone()))
            .filter(user_progress::Column::UserId.eq(user_id.clone()))
            .one(db)
            .await?;
        println!("9");
        Ok(ChapterDetails {
            chapter: Some(chapter),
            course_price,
            attachments,
            next_chapter,
            user_progress,
            purchase,
        })
    }

    pub async fn delete(
        db: &DbConn,
        user_id: String,
        course_id: String,
        chapter_id: String,
    ) -> Result<(), DbErr> {
        let owned_course = Course::find_by_id(course_id.clone())
            .filter(course::Column::UserId.eq(user_id.clone()))
            .one(db)
            .await?;

        match owned_course {
            Some(_) => (),
            _ => return Err(DbErr::Custom("Cannot find course".into())),
        };

        let chapter = Chapter::find_by_id(chapter_id.clone())
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .one(db)
            .await?;

        let chapter = match chapter {
            Some(chapter) => chapter,
            _ => return Err(DbErr::Custom("Cannot find chapter".into())),
        };

        if chapter.video_id.is_some() {
            let api_key =
                env::var("NEXT_PUBLIC_CLOUDINARY_API_KEY").expect("Cannot get Cloudinary api key");
            let cloud_name = env::var("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME")
                .expect("Cannot get Cloudinary cloud name");
            let api_secret =
                env::var("CLOUDINARY_API_SECRET").expect("Cannot get Cloudinary api secret");
            let upload = Upload::new(api_key, cloud_name, api_secret);
            let _ = upload
                .destroy(chapter.clone().video_id.unwrap())
                .await
                .unwrap();
        }

        chapter.delete(db).await?;

        let published_chapters_in_course = Chapter::find()
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .filter(chapter::Column::IsPublished.eq(true))
            .all(db)
            .await?;

        if published_chapters_in_course.len() == 0 {
            let mut update_course: course::ActiveModel = Course::find_by_id(course_id.clone())
                .one(db)
                .await?
                .unwrap()
                .into();

            update_course.is_published = Set(false);
            update_course.update(db).await?;
        }

        Ok(())
    }

    pub async fn publish(
        db: &DbConn,
        user_id: String,
        course_id: String,
        chapter_id: String,
    ) -> Result<(), DbErr> {
        let owned_course = Course::find_by_id(course_id.clone())
            .filter(course::Column::UserId.eq(user_id.clone()))
            .one(db)
            .await?;

        match owned_course {
            Some(_) => (),
            _ => return Err(DbErr::RecordNotFound("Cannot find course".into())),
        }

        let chapter = Chapter::find_by_id(chapter_id.clone())
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .one(db)
            .await?;

        let chapter = match chapter {
            Some(chapter) => chapter,
            _ => return Err(DbErr::RecordNotFound("Cannot find chapter".into())),
        };

        if chapter.description.is_none() || chapter.video_id.is_none() {
            return Err(DbErr::AttrNotSet("Missing required field".into()));
        }

        let mut chapter: chapter::ActiveModel = chapter.into();
        chapter.is_published = Set(true);
        chapter.update(db).await?;

        Ok(())
    }

    pub async fn unpublish(
        db: &DbConn,
        user_id: String,
        course_id: String,
        chapter_id: String,
    ) -> Result<(), DbErr> {
        let owned_course = Course::find_by_id(course_id.clone())
            .filter(course::Column::UserId.eq(user_id.clone()))
            .one(db)
            .await?;

        match owned_course {
            Some(_) => (),
            _ => return Err(DbErr::RecordNotFound("Cannot find course".into())),
        }

        let chapter = Chapter::find_by_id(chapter_id.clone())
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .one(db)
            .await?;

        let mut chapter: chapter::ActiveModel = match chapter {
            Some(chapter) => chapter.into(),
            _ => return Err(DbErr::RecordNotFound("Cannot find chapter".into())),
        };
        chapter.is_published = Set(false);
        chapter.update(db).await?;

        let published_chapters_in_course = Chapter::find()
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .filter(chapter::Column::IsPublished.eq(true))
            .all(db)
            .await?;

        if published_chapters_in_course.len() == 0 {
            let mut update_course: course::ActiveModel = Course::find_by_id(course_id.clone())
                .one(db)
                .await?
                .unwrap()
                .into();

            update_course.is_published = Set(false);
            update_course.update(db).await?;
        }

        Ok(())
    }

    pub async fn update_progress(
        db: &DbConn,
        user_id: String,
        chapter_id: String,
        is_completed: bool,
    ) -> Result<(), DbErr> {
        if let Some(existing_progress) = UserProgress::find()
            .filter(user_progress::Column::UserId.eq(user_id.clone()))
            .filter(user_progress::Column::ChapterId.eq(chapter_id.clone()))
            .one(db)
            .await?
        {
            let mut existing_progress: user_progress::ActiveModel = existing_progress.into();
            existing_progress.is_completed = Set(is_completed.into());
            existing_progress.updated_at = Set(Utc::now().naive_utc());
            existing_progress.update(db).await?;
        } else {
            let new_progress = user_progress::ActiveModel {
                id: Set(Uuid::new_v4().to_string()),
                user_id: Set(user_id.clone()),
                chapter_id: Set(chapter_id.clone()),
                is_completed: Set(is_completed.clone()),
                created_at: Set(Utc::now().naive_utc()),
                updated_at: Set(Utc::now().naive_utc()),
                ..Default::default()
            };
            new_progress.insert(db).await?;
        }

        Ok(())
    }

    pub async fn reorder(
        db: &DbConn,
        user_id: String,
        course_id: String,
        list: Vec<ReorderData>,
    ) -> Result<Vec<chapter::Model>, DbErr> {
        let owned_course = Course::find_by_id(course_id.clone())
            .filter(course::Column::UserId.eq(user_id.clone()))
            .one(db)
            .await?;

        match owned_course {
            Some(_) => (),
            _ => return Err(DbErr::RecordNotFound("Cannot find course".into())),
        }

        for item in list.iter() {
            let mut update_chapter: chapter::ActiveModel = Chapter::find_by_id(item.id.clone())
                .one(db)
                .await?
                .unwrap()
                .into();

            update_chapter.position = Set(item.position.into());
            update_chapter.update(db).await?;
        }

        let chapter = Chapter::find()
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .order_by_asc(chapter::Column::Position)
            .all(db)
            .await?;

        Ok(chapter)
    }

    pub async fn create(
        db: &DbConn,
        user_id: String,
        course_id: String,
        title: String,
    ) -> Result<Vec<chapter::Model>, DbErr> {
        let owned_coruse = Course::find_by_id(course_id.clone())
            .filter(course::Column::UserId.eq(user_id.clone()))
            .one(db)
            .await?;

        if owned_coruse.is_none() {
            return Err(DbErr::RecordNotFound("Cannot find course".into()));
        }

        let last_chapter = Chapter::find()
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .order_by_asc(chapter::Column::Position)
            .one(db)
            .await?;

        let new_postion = match last_chapter {
            Some(chapter) => chapter.position + 1,
            _ => 1,
        };

        let chapter = chapter::ActiveModel {
            id: Set(Uuid::new_v4().to_string()),
            title: Set(title.clone()),
            course_id: Set(course_id.clone()),
            position: Set(new_postion.clone()),
            created_at: Set(Utc::now().naive_utc()),
            updated_at: Set(Utc::now().naive_utc()),
            ..Default::default()
        };

        chapter.insert(db).await?;

        let res = Chapter::find()
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .order_by_asc(chapter::Column::Position)
            .all(db)
            .await?;

        Ok(res)
    }

    pub async fn update(
        db: &DbConn,
        user_id: String,
        course_id: String,
        chapter_id: String,
        updates: std::collections::HashMap<String, Value>,
    ) -> Result<(), DbErr> {
        let owned_course = Course::find_by_id(course_id.clone())
            .filter(course::Column::UserId.eq(user_id.clone()))
            .one(db)
            .await?;

        match owned_course {
            Some(_) => (),
            _ => return Err(DbErr::RecordNotFound("Cannot find course".into())),
        }

        let mut chapter: chapter::ActiveModel = Chapter::find_by_id(chapter_id.clone())
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .one(db)
            .await?
            .unwrap()
            .into();

        for (key, value) in updates.iter() {
            match key.as_str() {
                "isFree" => {
                    if let Some(is_free) = value.as_bool() {
                        chapter.is_free = Set(is_free);
                    }
                }
                "description" => {
                    if let Some(description) = value.as_str() {
                        chapter.description = Set(Some(description.to_string()));
                    }
                }
                "videoId" => {
                    if let Some(video_id) = value.as_str() {
                        let old_video_id = chapter.video_id.unwrap();
                        if let Some(old_video_id) = old_video_id {
                            let api_key = env::var("NEXT_PUBLIC_CLOUDINARY_API_KEY")
                                .expect("Cannot get Cloudinary api key");
                            let cloud_name = env::var("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME")
                                .expect("Cannot get Cloudinary cloud name");
                            let api_secret = env::var("CLOUDINARY_API_SECRET")
                                .expect("Cannot get Cloudinary api secret");
                            let upload = Upload::new(api_key, cloud_name, api_secret);
                            let _ = upload.destroy(old_video_id).await.unwrap();
                        }

                        chapter.video_id = Set(Some(video_id.to_string()));
                    }
                }
                "title" => {
                    if let Some(title) = value.as_str() {
                        chapter.title = Set(title.to_string());
                    }
                }
                _ => continue,
            }
        }

        chapter.update(db).await?;
        Ok(())
    }
}
