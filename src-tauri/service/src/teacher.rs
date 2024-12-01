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
pub struct TeacherCourseData {
    name: String,
    total: i32,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TeacherAnalytics {
    data: Vec<TeacherCourseData>,
    total_revenue: i32,
    total_sales: i32,
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
    ) -> Result<chapter::Model, DbErr> {
        let chapter = Chapter::find_by_id(chapter_id.clone())
            .filter(chapter::Column::CourseId.eq(course_id.clone()))
            .one(db)
            .await?;

        let chapter = match chapter {
            Some(chapter) => chapter,
            _ => return Err(DbErr::RecordNotFound("Cannot find chapter".into())),
        };

        Ok(chapter)
    }

    pub async fn analytics(db: &DbConn, user_id: String) -> Result<TeacherAnalytics, DbErr> {
        let purchases = Purchase::find()
            .filter(purchase::Column::UserId.eq(user_id.clone()))
            .all(db)
            .await?;

        if purchases.len() == 0 {
            return Ok(TeacherAnalytics {
                data: vec![],
                total_revenue: 0,
                total_sales: 0,
            });
        }

        let mut data: Vec<TeacherCourseData> = Vec::new();
        let mut total_revenue: i32 = 0;
        let total_sales: i32 = purchases.len() as i32;

        for purchase in purchases {
            let course = course::Entity::find_by_id(purchase.course_id.clone())
                .one(db)
                .await?;

            let course_names: Vec<String> = data.iter().map(|c| c.name.clone()).collect();

            if let Some(course) = course {
                if !course_names.contains(&course.title) {
                    data.push(TeacherCourseData {
                        name: course.title.to_string(),
                        total: 0,
                    });
                }
                data.iter_mut()
                    .map(|d| {
                        if d.name == course.title.to_string() {
                            d.total += course.price.unwrap();
                        }
                    })
                    .count();

                total_revenue += course.price.unwrap();
            }
        }

        Ok(TeacherAnalytics {
            data: data,
            total_revenue: total_revenue,
            total_sales: total_sales,
        })
    }
}
