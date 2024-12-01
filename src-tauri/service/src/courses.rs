use std::env;

use ::entities::{prelude::*, *};
use sea_orm::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::types::{chrono::Utc, Uuid};

use cloudinary::upload::Upload;

pub struct Courses;

#[derive(FromQueryResult, Debug, Serialize, Deserialize)]
struct ChapterId {
    id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseWithChaptersAndProgress {
    #[serde(flatten)]
    course: course::Model,
    chapters: Vec<ChapterWithProgress>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct ChapterWithProgress {
    #[serde(flatten)]
    chapter: chapter::Model,
    user_progress: Vec<user_progress::Model>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseWithChapters {
    #[serde(flatten)]
    course: course::Model,
    chapters: Vec<chapter::Model>,
}

impl Courses {
    pub async fn create(
        db: &DbConn,
        user_id: String,
        title: String,
    ) -> Result<course::Model, DbErr> {
        let new_course = course::ActiveModel {
            id: Set(Uuid::new_v4().to_string()),
            user_id: Set(user_id),
            title: Set(title),
            created_at: Set(Utc::now().naive_utc()),
            updated_at: Set(Utc::now().naive_utc()),
            ..Default::default()
        };

        let new_course: course::Model = new_course.insert(db).await?;
        Ok(new_course)
    }

    pub async fn update(
        db: &DbConn,
        course_id: String,
        updates: std::collections::HashMap<String, Value>,
    ) -> Result<(), DbErr> {
        let mut course: course::ActiveModel =
            Course::find_by_id(course_id).one(db).await?.unwrap().into();

        for (key, value) in updates.iter() {
            match key.as_str() {
                "categoryId" => {
                    if let Some(category_id) = value.as_str() {
                        course.category_id = Set(Some(category_id.to_string()));
                    }
                }
                "description" => {
                    if let Some(description) = value.as_str() {
                        course.description = Set(Some(description.to_string()));
                    }
                }
                "imageUrl" => {
                    if let Some(image_url) = value.as_str() {
                        match course.image_url.unwrap() {
                            Some(url) => {
                                let pid: &str =
                                    url.split("/").last().unwrap().split(".").next().unwrap();

                                let api_key = env::var("NEXT_PUBLIC_CLOUDINARY_API_KEY")
                                    .expect("Cannot get Cloudinary api key");
                                let cloud_name = env::var("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME")
                                    .expect("Cannot get Cloudinary cloud name");
                                let api_secret = env::var("CLOUDINARY_API_SECRET")
                                    .expect("Cannot get Cloudinary api secret");
                                let upload = Upload::new(api_key, cloud_name, api_secret);
                                let _ = upload.destroy(pid).await.unwrap();
                            }
                            _ => {}
                        }
                        course.image_url = Set(Some(image_url.to_string()));
                    }
                }
                "title" => {
                    if let Some(title) = value.as_str() {
                        course.title = Set(title.to_string());
                    }
                }
                "price" => {
                    if let Some(price) = value.as_i64() {
                        course.price = Set(Some(price as i32));
                    }
                }
                _ => continue,
            }
        }

        course.update(db).await?;
        Ok(())
    }

    pub async fn list(db: &DbConn, user_id: String) -> Result<Vec<course::Model>, DbErr> {
        println!("Lmao");
        let courses = Course::find()
            .filter(course::Column::UserId.eq(user_id))
            .all(db)
            .await?;

        for course in courses.iter() {
            println!("{:?}", course);
        }

        Ok(courses)
    }

    pub async fn add_attachment(
        db: &DbConn,
        user_id: String,
        course_id: String,
        url: String,
    ) -> Result<Vec<attachment::Model>, DbErr> {
        let course_owner = Course::find_by_id(course_id.clone())
            .filter(course::Column::UserId.eq(user_id))
            .all(db)
            .await?;

        if course_owner.is_empty() {
            return Err(DbErr::Custom("Authentication Error".into()));
        }

        let new_attachment = attachment::ActiveModel {
            id: Set(Uuid::new_v4().to_string()),
            url: Set(url.clone()),
            name: Set(url.split("/").last().unwrap().to_string()),
            course_id: Set(course_id.clone()),
            created_at: Set(Utc::now().naive_utc()),
            updated_at: Set(Utc::now().naive_utc()),
            ..Default::default()
        };

        new_attachment.insert(db).await?;

        let res = Attachment::find()
            .filter(attachment::Column::CourseId.eq(course_id))
            .all(db)
            .await?;
        Ok(res)
    }

    pub async fn remove_attachment(
        db: &DbConn,
        user_id: String,
        attachment_id: String,
        course_id: String,
    ) -> Result<Vec<attachment::Model>, DbErr> {
        let course_owner = Course::find_by_id(course_id.clone())
            .filter(course::Column::UserId.eq(user_id))
            .all(db)
            .await?;

        if course_owner.is_empty() {
            return Err(DbErr::Custom("Authentication Error".into()));
        }

        let delete_attachment = Attachment::find_by_id(attachment_id)
            .filter(attachment::Column::CourseId.eq(course_id.clone()))
            .one(db)
            .await?
            .unwrap();

        let pid: &str = &delete_attachment
            .url
            .split("/")
            .last()
            .unwrap()
            .split(".")
            .next()
            .unwrap();

        let api_key =
            env::var("NEXT_PUBLIC_CLOUDINARY_API_KEY").expect("Cannot get Cloudinary api key");
        let cloud_name = env::var("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME")
            .expect("Cannot get Cloudinary cloud name");
        let api_secret =
            env::var("CLOUDINARY_API_SECRET").expect("Cannot get Cloudinary api secret");
        let upload = Upload::new(api_key, cloud_name, api_secret);
        let _ = upload.destroy(pid).await.unwrap();

        delete_attachment.delete(db).await?;

        let res = Attachment::find()
            .filter(attachment::Column::CourseId.eq(course_id))
            .all(db)
            .await?;
        Ok(res)
    }

    pub async fn delete(db: &DbConn, user_id: String, course_id: String) -> Result<(), DbErr> {
        let delete_course = Course::find_by_id(course_id.clone())
            .filter(course::Column::UserId.eq(user_id.clone()))
            .one(db)
            .await?;

        let delete_course = match delete_course {
            Some(course) => course,
            None => return Err(DbErr::Custom("Cannot find course".into())),
        };

        let chapters = Chapter::find()
            .filter(chapter::Column::CourseId.eq(course_id))
            .all(db)
            .await?;

        for chapter in chapters.iter() {
            match chapter.video_id.clone() {
                Some(pid) => {
                    let api_key = env::var("NEXT_PUBLIC_CLOUDINARY_API_KEY")
                        .expect("Cannot get Cloudinary api key");
                    let cloud_name = env::var("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME")
                        .expect("Cannot get Cloudinary cloud name");
                    let api_secret = env::var("CLOUDINARY_API_SECRET")
                        .expect("Cannot get Cloudinary api secret");
                    let upload = Upload::new(api_key, cloud_name, api_secret);
                    let _ = upload.destroy(pid).await.unwrap();
                }
                _ => {}
            }
        }

        delete_course.delete(db).await?;

        Ok(())
    }

    pub async fn unpublish(db: &DbConn, user_id: String, course_id: String) -> Result<(), DbErr> {
        let course = Course::find_by_id(course_id.clone())
            .filter(course::Column::UserId.eq(user_id.clone()))
            .one(db)
            .await?;

        match course.clone() {
            Some(_) => (),
            None => return Err(DbErr::Custom("Cannot find course".into())),
        };

        let mut course: course::ActiveModel = course.unwrap().into();
        course.is_published = Set(false);
        course.update(db).await?;

        Ok(())
    }

    pub async fn publish(db: &DbConn, user_id: String, course_id: String) -> Result<(), DbErr> {
        let course = Course::find_by_id(course_id.clone())
            .filter(course::Column::UserId.eq(user_id.clone()))
            .one(db)
            .await?;

        let publish_course = match course.clone() {
            Some(course) => course,
            None => return Err(DbErr::Custom("Cannot find course".into())),
        };

        let chapters = chapter::Entity::find()
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .all(db)
            .await?;

        let has_published_chapter = chapters.iter().any(|chapter| chapter.is_published);

        if !(publish_course.description.is_some()
            && publish_course.image_url.is_some()
            && publish_course.category_id.is_some()
            && has_published_chapter)
        {
            return Err(DbErr::Custom("Missing required fields".into()));
        }

        let mut course: course::ActiveModel = course.unwrap().into();
        course.is_published = Set(true);
        course.update(db).await?;

        Ok(())
    }

    pub async fn get(db: &DbConn, course_id: String) -> Result<CourseWithChapters, DbErr> {
        let course = Course::find_by_id(course_id.clone())
            .one(db)
            .await?
            .unwrap();

        let chapters = Chapter::find()
            .filter(chapter::Column::CourseId.eq(course_id))
            .all(db)
            .await?;

        Ok(CourseWithChapters { course, chapters })
    }

    pub async fn get_with_chapters_with_progress(
        db: &DbConn,
        user_id: String,
        course_id: String,
    ) -> Result<CourseWithChaptersAndProgress, DbErr> {
        // Step 1: Find the course by id
        let course = course::Entity::find()
            .filter(course::Column::Id.eq(course_id.clone()))
            .one(db)
            .await?;

        // If no course is found, return None
        let course = match course {
            Some(course) => course,
            None => return Err(DbErr::Custom("Cannot find course".into())),
        };

        // Step 2: Find related chapters for this course, ordered by position, and include userProgress
        let chapters_with_progress: Vec<ChapterWithProgress> = chapter::Entity::find()
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .filter(chapter::Column::IsPublished.eq(true)) // Filter for published chapters
            .order_by_asc(chapter::Column::Position) // Order by position in ascending order
            .find_also_related(user_progress::Entity)
            .all(db)
            .await?
            .into_iter()
            .filter_map(|(chapter, progress)| {
                // Filter userProgress by user_id
                let user_progress: Vec<user_progress::Model> = progress
                    .into_iter()
                    .filter(|up| up.user_id == user_id)
                    .collect();

                Some(ChapterWithProgress {
                    chapter,
                    user_progress,
                })
            })
            .collect();

        Ok(CourseWithChaptersAndProgress {
            course,
            chapters: chapters_with_progress,
        })
    }

    pub async fn get_progress_percentage(
        db: &DbConn,
        user_id: String,
        course_id: String,
    ) -> Result<u8, DbErr> {
        let published_chapters = Chapter::find()
            .select_only()
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .filter(chapter::Column::IsPublished.eq(true))
            .column(chapter::Column::Id)
            .into_model::<ChapterId>()
            .all(db)
            .await?;

        let published_chapter_ids: Vec<String> = published_chapters
            .into_iter()
            .map(|chapter| chapter.id)
            .collect();

        let valid_completed_chapters = UserProgress::find()
            .filter(user_progress::Column::UserId.eq(user_id.clone()))
            .filter(user_progress::Column::ChapterId.is_in(published_chapter_ids.clone()))
            .filter(user_progress::Column::IsCompleted.eq(true))
            .count(db)
            .await?;

        let progress_percentage = if !published_chapter_ids.is_empty() {
            (valid_completed_chapters as f32 / published_chapter_ids.len() as f32) * 100.0
        } else {
            0.0
        };

        let progress_percentage = progress_percentage.round() as u8;

        Ok(progress_percentage)
    }
}
