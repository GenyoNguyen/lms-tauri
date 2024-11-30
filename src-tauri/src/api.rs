use std::sync::Arc;

use entities::{attachment, category, chapter, course, purchase};
use sea_orm::DbErr;
use serde_json::Value;
use service::{
    ChapterDetails, Chapters, CourseWithChapters, CourseWithChaptersAndProgress, Courses,
    DashboardCourses, OtherRoutes, ReorderData, SearchCourseWithProgressWithCategory, Teacher,
    TeacherAnalytics, TeacherChapterWithMuxData, TeacherCourse,
};

use crate::AppState;

#[tauri::command]
pub async fn get_dashboard_courses(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
) -> Result<DashboardCourses, String> {
    let db = state.conn.lock().await;
    if let Ok(res) = OtherRoutes::dashboard_courses(&db, user_id).await {
        Ok(res)
    } else {
        Err("Cannot get dashboard courses".into())
    }
}

#[tauri::command]
pub async fn get_purchase(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
) -> Result<Option<purchase::Model>, String> {
    let db = state.conn.lock().await;
    if let Ok(res) = OtherRoutes::purchase(&db, user_id, course_id).await {
        Ok(res)
    } else {
        Err("Cannot get course purchase".into())
    }
}

#[tauri::command]
pub async fn get_categories(
    state: tauri::State<'_, Arc<AppState>>,
) -> Result<Vec<category::Model>, String> {
    let db = state.conn.lock().await;
    if let Ok(res) = OtherRoutes::categories(&db).await {
        Ok(res)
    } else {
        Err("Cannot get categories".into())
    }
}

#[tauri::command]
pub async fn get_search(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    title: Option<String>,
    category_id: Option<String>,
) -> Result<Vec<SearchCourseWithProgressWithCategory>, String> {
    let db = state.conn.lock().await;
    if let Ok(res) = OtherRoutes::search(&db, user_id, title, category_id).await {
        Ok(res)
    } else {
        Err("Cannot search".into())
    }
}

#[tauri::command]
pub async fn create_course(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    title: String,
) -> Result<course::Model, String> {
    let db = state.conn.lock().await;
    if let Ok(res) = Courses::create(&db, user_id, title).await {
        Ok(res)
    } else {
        Err("Cannot create course".into())
    }
}

#[tauri::command]
pub async fn update_course(
    state: tauri::State<'_, Arc<AppState>>,
    course_id: String,
    updates: std::collections::HashMap<String, Value>,
) -> Result<(), String> {
    let db = state.conn.lock().await;
    if let Ok(_) = Courses::update(&db, course_id, updates).await {
        Ok(())
    } else {
        Err("Cannot update course".into())
    }
}

#[tauri::command]
pub async fn add_attachment(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
    url: String,
) -> Result<Vec<attachment::Model>, String> {
    let db = state.conn.lock().await;
    if let Ok(res) = Courses::add_attachment(&db, user_id, course_id, url).await {
        Ok(res)
    } else {
        Err("Cannot add attachment".into())
    }
}

#[tauri::command]
pub async fn remove_attachment(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    attachment_id: String,
    course_id: String,
) -> Result<Vec<attachment::Model>, String> {
    let db = state.conn.lock().await;
    if let Ok(res) = Courses::remove_attachment(&db, user_id, attachment_id, course_id).await {
        Ok(res)
    } else {
        Err("Cannot remove attachment".into())
    }
}

#[tauri::command]
pub async fn delete_course(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
) -> Result<(), String> {
    let db = state.conn.lock().await;
    if let Ok(_) = Courses::delete(&db, user_id, course_id).await {
        Ok(())
    } else {
        Err("Cannot delete course".into())
    }
}

#[tauri::command]
pub async fn publish_course(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
) -> Result<(), String> {
    let db = state.conn.lock().await;
    if let Ok(_) = Courses::publish(&db, user_id, course_id).await {
        Ok(())
    } else {
        Err("Cannot publish course".into())
    }
}

#[tauri::command]
pub async fn unpublish_course(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
) -> Result<(), String> {
    let db = state.conn.lock().await;
    if let Ok(_) = Courses::unpublish(&db, user_id, course_id).await {
        Ok(())
    } else {
        Err("Cannot unpublish course".into())
    }
}

#[tauri::command]
pub async fn get_course(
    state: tauri::State<'_, Arc<AppState>>,
    course_id: String,
) -> Result<CourseWithChapters, String> {
    let db = state.conn.lock().await;
    if let Ok(course) = Courses::get(&db, course_id).await {
        Ok(course)
    } else {
        Err("Cannot get course".into())
    }
}

#[tauri::command]
pub async fn get_course_with_chapters_with_progress(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
) -> Result<CourseWithChaptersAndProgress, String> {
    let db = state.conn.lock().await;
    if let Ok(course) = Courses::get_with_chapters_with_progress(&db, user_id, course_id).await {
        Ok(course)
    } else {
        Err("Cannot get course with chapters with progress".into())
    }
}

#[tauri::command]
pub async fn get_progress_percentage(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
) -> Result<u8, String> {
    let db = state.conn.lock().await;
    if let Ok(progress_percentage) = Courses::get_progress_percentage(&db, user_id, course_id).await
    {
        Ok(progress_percentage)
    } else {
        Err("Cannot get progress percentage".into())
    }
}

#[tauri::command]
pub async fn get_chapter(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
    chapter_id: String,
) -> Result<ChapterDetails, String> {
    let db = state.conn.lock().await;
    if let Ok(chapter) = Chapters::get(&db, user_id, course_id, chapter_id).await {
        Ok(chapter)
    } else {
        Err("Cannot get chapter".into())
    }
}

#[tauri::command]
pub async fn delete_chapter(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
    chapter_id: String,
) -> Result<(), String> {
    let db = state.conn.lock().await;
    if let Ok(_) = Chapters::delete(&db, user_id, course_id, chapter_id).await {
        Ok(())
    } else {
        Err("Cannot delete chapter".into())
    }
}

#[tauri::command]
pub async fn publish_chapter(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
    chapter_id: String,
) -> Result<(), String> {
    let db = state.conn.lock().await;
    match Chapters::publish(&db, user_id, course_id, chapter_id).await {
        Ok(_) => Ok(()),
        Err(DbErr::RecordNotFound(err)) => Err(err),
        Err(DbErr::AttrNotSet(err)) => Err(err),
        _ => Err("Cannot publish chapter".into()),
    }
}

#[tauri::command]
pub async fn unpublish_chapter(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
    chapter_id: String,
) -> Result<(), String> {
    let db = state.conn.lock().await;
    if let Ok(_) = Chapters::unpublish(&db, user_id, course_id, chapter_id).await {
        Ok(())
    } else {
        Err("Cannot publish chapter".into())
    }
}

#[tauri::command]
pub async fn update_chapter_progress(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    chapter_id: String,
    is_completed: bool,
) -> Result<(), String> {
    let db = state.conn.lock().await;
    if let Ok(_) = Chapters::update_progress(&db, user_id, chapter_id, is_completed).await {
        Ok(())
    } else {
        Err("Cannot update chapter progress".into())
    }
}

#[tauri::command]
pub async fn reorder_chapters(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
    list: Vec<ReorderData>,
) -> Result<Vec<chapter::Model>, String> {
    let db = state.conn.lock().await;
    if let Ok(chapter) = Chapters::reorder(&db, user_id, course_id, list).await {
        Ok(chapter)
    } else {
        Err("Cannot reorder chapters".into())
    }
}

#[tauri::command]
pub async fn create_chapter(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
    title: String,
) -> Result<Vec<chapter::Model>, String> {
    let db = state.conn.lock().await;
    if let Ok(chapter) = Chapters::create(&db, user_id, course_id, title).await {
        Ok(chapter)
    } else {
        Err("Cannot create chapter".into())
    }
}

#[tauri::command]
pub async fn update_chapter(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
    chapter_id: String,
    updates: std::collections::HashMap<String, Value>,
) -> Result<(), String> {
    let db = state.conn.lock().await;
    match Chapters::update(&db, user_id, course_id, chapter_id, updates).await {
        Ok(_) => Ok(()),
        Err(DbErr::RecordNotFound(err)) => Err(err),
        Err(DbErr::AttrNotSet(err)) => Err(err),
        Err(DbErr::Custom(err)) => Err(err),
        _ => Err("Cannot update chapter".into()),
    }
}

#[tauri::command]
pub async fn get_teacher_course(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
    course_id: String,
) -> Result<TeacherCourse, String> {
    let db = state.conn.lock().await;
    match Teacher::course(&db, user_id, course_id).await {
        Ok(coruse) => Ok(coruse),
        Err(DbErr::RecordNotFound(err)) => Err(err),
        Err(DbErr::AttrNotSet(err)) => Err(err),
        Err(DbErr::Custom(err)) => Err(err),
        _ => Err("Cannot get teacher course".into()),
    }
}

#[tauri::command]
pub async fn get_teacher_chapter(
    state: tauri::State<'_, Arc<AppState>>,
    course_id: String,
    chapter_id: String,
) -> Result<TeacherChapterWithMuxData, String> {
    let db = state.conn.lock().await;
    match Teacher::chapter(&db, course_id, chapter_id).await {
        Ok(coruse) => Ok(coruse),
        Err(DbErr::RecordNotFound(err)) => Err(err),
        _ => Err("Cannot get teacher course".into()),
    }
}

#[tauri::command]
pub async fn get_teacher_analytics(
    state: tauri::State<'_, Arc<AppState>>,
    user_id: String,
) -> Result<TeacherAnalytics, String> {
    let db = state.conn.lock().await;
    match Teacher::analytics(&db, user_id).await {
        Ok(analytics) => Ok(analytics),
        _ => Err("Cannot get teacher analytics".into()),
    }
}
