use ::entities::{prelude::*, *};
use sea_orm::*;
use serde::{Deserialize, Serialize};

pub struct OtherRoutes;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct CourseWithProgressWithCategory {
    #[serde(flatten)]
    course: course::Model,
    category: Option<category::Model>,
    chapters: Vec<chapter::Model>,
    progress: Option<i8>,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct DashboardCourses {
    completed_courses: Vec<CourseWithProgressWithCategory>,
    courses_in_progress: Vec<CourseWithProgressWithCategory>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchCourseWithProgressWithCategory {
    #[serde(flatten)]
    course: course::Model,
    category: Option<category::Model>,
    chapters: Vec<ChapterIdOnly>,
    progress: Option<i8>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, FromQueryResult, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChapterIdOnly {
    id: String,
}

impl OtherRoutes {
    pub async fn dashboard_courses(
        db: &DbConn,
        user_id: String,
    ) -> Result<DashboardCourses, DbErr> {
        // Step 1: Fetch purchases with related courses
        let purchases_with_courses = Purchase::find()
            .filter(purchase::Column::UserId.eq(user_id.clone()))
            .find_with_related(Course)
            .all(db)
            .await?;

        // Step 2: Prepare the final result
        let mut completed_courses = Vec::new();
        let mut courses_in_progress = Vec::new();

        for (_purchase, courses) in purchases_with_courses {
            for course in courses {
                // Fetch the category for the course
                let category = course.find_related(Category).one(db).await?;

                // Fetch all chapters for the course
                let chapters = Chapter::find()
                    .filter(chapter::Column::CourseId.eq(course.id.clone()))
                    .filter(chapter::Column::IsPublished.eq(true))
                    .all(db)
                    .await?;

                // Calculate progress
                let total_chapters = chapters.len() as f32;
                let completed_chapters = user_progress::Entity::find()
                    .filter(user_progress::Column::UserId.eq(user_id.clone()))
                    .filter(
                        user_progress::Column::ChapterId
                            .is_in(chapters.iter().map(|ch| ch.id.clone())),
                    )
                    .filter(user_progress::Column::IsCompleted.eq(true))
                    .all(db)
                    .await?;
                let completed_chapters_len = completed_chapters.len() as f32;

                let progress = if total_chapters > 0.0 {
                    Some(((completed_chapters_len / total_chapters) * 100.0) as i8)
                } else {
                    Some(0)
                };

                // Append course with category, chapters, and progress to result
                match progress {
                    Some(100) => {
                        completed_courses.push(CourseWithProgressWithCategory {
                            course,
                            category,
                            chapters,
                            progress,
                        });
                    }
                    _ => {
                        courses_in_progress.push(CourseWithProgressWithCategory {
                            course,
                            category,
                            chapters,
                            progress,
                        });
                    }
                }
            }
        }

        Ok(DashboardCourses {
            completed_courses,
            courses_in_progress,
        })
    }

    pub async fn purchase(
        db: &DatabaseConnection,
        user_id: String,
        course_id: String,
    ) -> Result<purchase::Model, DbErr> {
        let result = purchase::Entity::find()
            .filter(purchase::Column::UserId.eq(user_id)) // Filter by userId
            .filter(purchase::Column::CourseId.eq(course_id)) // Filter by courseId
            .one(db) // Retrieve one record
            .await
            .unwrap()
            .unwrap();
        Ok(result)
    }

    pub async fn categories(db: &DatabaseConnection) -> Result<Vec<category::Model>, DbErr> {
        let result = Category::find()
            .order_by_asc(category::Column::Name)
            .all(db)
            .await
            .unwrap();

        Ok(result)
    }

    pub async fn search(
        db: &DatabaseConnection,
        user_id: String,
        title: Option<String>,
        category_id: Option<String>,
    ) -> Result<Vec<SearchCourseWithProgressWithCategory>, DbErr> {
        // Step 1: Fetch published courses with the specified filters
        let mut courses_query = course::Entity::find()
            .filter(course::Column::IsPublished.eq(true))
            .order_by_desc(course::Column::CreatedAt);

        if let Some(title) = title {
            courses_query = courses_query.filter(course::Column::Title.contains(&title));
        }
        if let Some(category_id) = category_id {
            courses_query = courses_query.filter(course::Column::CategoryId.eq(category_id));
        }

        let courses_with_relations = courses_query
            .find_also_related(category::Entity)
            .all(db)
            .await
            .unwrap();

        // Step 2: Fetch chapters for each course and filter by isPublished
        let mut result = Vec::new();

        for (course, category) in courses_with_relations {
            // Fetch only published chapters with id field
            let chapters = chapter::Entity::find()
                .filter(chapter::Column::CourseId.eq(course.id.clone()))
                .filter(chapter::Column::IsPublished.eq(true))
                .select_only()
                .column(chapter::Column::Id)
                .into_model::<ChapterIdOnly>()
                .all(db)
                .await
                .unwrap();

            // Check if there is a purchase by the user for this course
            let purchase_exists = purchase::Entity::find()
                .filter(purchase::Column::UserId.eq(user_id.clone()))
                .filter(purchase::Column::CourseId.eq(course.id.clone()))
                .one(db)
                .await
                .unwrap()
                .is_some();

            // Calculate progress if there is a purchase
            let progress: Option<i8> = if purchase_exists {
                // Calculate progress
                let total_chapters = chapters.len() as f32;
                let completed_chapters = user_progress::Entity::find()
                    .filter(user_progress::Column::UserId.eq(user_id.clone()))
                    .filter(
                        user_progress::Column::ChapterId
                            .is_in(chapters.iter().map(|ch| ch.id.clone())),
                    )
                    .filter(user_progress::Column::IsCompleted.eq(true))
                    .all(db)
                    .await
                    .unwrap();

                let completed_chapters_len = completed_chapters.len() as f32;

                let res = if total_chapters > 0.0 {
                    Some(((completed_chapters_len / total_chapters) * 100.0) as i8)
                } else {
                    Some(0)
                };
                res
            } else {
                None
            };

            // Add course data to result
            result.push(SearchCourseWithProgressWithCategory {
                course,
                category,
                chapters,
                progress,
            });
        }

        Ok(result)
    }
}
