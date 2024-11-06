use ::entities::{prelude::*, *};
use sea_orm::*;
use serde::Serialize;

pub struct Teacher;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TeacherCourse {
    #[serde(flatten)]
    course: course::Model,
    chapters: Vec<chapter::Model>,
    attachments: Vec<attachment::Model>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TeacherChapterWithMuxData {
    #[serde(flatten)]
    chapter: chapter::Model,
    mux_data: Option<mux_data::Model>,
}

impl Teacher {
    pub async fn course(
        db: &DbConn,
        user_id: String,
        course_id: String,
    ) -> Result<TeacherCourse, DbErr> {
        // Step 1: Find the course by `id` and `userId`
        let course = course::Entity::find()
            .filter(course::Column::Id.eq(course_id.clone()))
            .filter(course::Column::UserId.eq(user_id.clone()))
            .one(db)
            .await?;

        // If the course is not found, return None
        let course = match course {
            Some(course) => course,
            None => return Err(DbErr::RecordNotFound("Cannot find course".into())),
        };

        // Step 2: Find related chapters for this course, ordered by position in ascending order
        let chapters = chapter::Entity::find()
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .order_by_asc(chapter::Column::Position) // Order by position ASC
            .all(db)
            .await?;

        // Step 3: Find related attachments for this course, ordered by createdAt in descending order
        let attachments = attachment::Entity::find()
            .filter(attachment::Column::CourseId.eq(course_id.clone()))
            .order_by_desc(attachment::Column::CreatedAt) // Order by createdAt DESC
            .all(db)
            .await?;

        // Construct the final result
        Ok(TeacherCourse {
            course,
            chapters,
            attachments,
        })
    }

    pub async fn chapter(
        db: &DbConn,
        course_id: String,
        chapter_id: String,
    ) -> Result<TeacherChapterWithMuxData, DbErr> {
        let chapter = Chapter::find_by_id(chapter_id.clone())
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .one(db)
            .await?;

        let chapter = match chapter {
            Some(chapter) => chapter,
            _ => return Err(DbErr::RecordNotFound("Cannot find chapter".into())),
        };

        let mux_data = MuxData::find()
            .filter(mux_data::Column::ChapterId.eq(chapter_id.clone()))
            .one(db)
            .await?;

        Ok(TeacherChapterWithMuxData { chapter, mux_data })
    }
}
