use std::sync::Arc;

use entities::{attachment, category, course, purchase};
use serde_json::Value;
use service::{Courses, DashboardCourses, OtherRoutes, SearchCourseWithProgressWithCategory};

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
) -> Result<purchase::Model, String> {
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
