use ::entities::{prelude::*, *};
use sea_orm::*;
use serde_json::Value;
use sqlx::types::{chrono::Utc, Uuid};

pub struct Courses;

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
                        course.price = Set(Some(price as i64));
                    }
                }
                _ => continue,
            }
        }

        course.update(db).await?;
        Ok(())
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
        delete_attachment.delete(db).await?;

        let res = Attachment::find()
            .filter(attachment::Column::CourseId.eq(course_id))
            .all(db)
            .await?;
        Ok(res)
    }
}
