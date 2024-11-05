use sea_orm::{Database, DatabaseConnection};
use std::collections::VecDeque;
use std::sync::Arc;
use tauri::State;
use tokio::sync::Mutex;

use std::env;

mod loader;
mod textgen;

mod api;
use api::*;

const CHAT_TEMPLATE: &str = "[INST] Bạn tên là Ps Retrov, giáo viên tư vấn học tập cho học sinh nhỏ tuổi, tinh thần thoải mái. 
- Không lặp lại câu trả lời, không lặp lại câu hỏi của người dùng.
- Chỉ trả lời thông tin mới khi được yêu cầu.
- Không đặt câu hỏi hay thêm thông tin không được yêu cầu.
- Nếu người dùng chào, hãy chào vui vẻ và không đặt câu hỏi.
- Không gửi URL.
- Khi code chỉ đưa ra lời giải thích ngắn gọn nhất và tập trung vào phần code hoặc giải thích trọng tâm.

Hãy trả lời trung thực, chính xác, ngắn gọn, đúng trọng tâm, vui vẻ và thêm icon phù hợp. 😊 [/INST]";
const MAX_HISTORY: usize = 20; // Giới hạn lịch sử hội thoại

// Cấu trúc AppState
pub struct AppState {
    pub textgen: Mutex<textgen::TextGeneration>,
    pub history: Mutex<VecDeque<(String, String)>>, // Thêm `history` để lưu lịch sử hội thoại
    pub conn: Mutex<DatabaseConnection>,
}

// Hàm định dạng prompt với CHAT_TEMPLATE và history
fn format_prompt(new_prompt: &str, history: &VecDeque<(String, String)>) -> String {
    let history_str = history
        .iter()
        .map(|(user_prompt, model_response)| {
            format!("[INST] {} [/INST] {} </s>", user_prompt, model_response)
        })
        .collect::<Vec<String>>()
        .join(" ");

    format!(
        "{} {} [INST] {} [/INST]",
        CHAT_TEMPLATE, history_str, new_prompt
    )
}

#[tauri::command]
async fn generate_text(
    prompt: String,
    sample_len: usize,
    state: State<'_, Arc<AppState>>,
) -> Result<String, String> {
    println!("Received prompt: {}", prompt);

    // Acquire history lock
    let mut history = state.history.lock().await;

    // Format the prompt
    let formatted_prompt = format_prompt(&prompt, &history);
    println!("Formatted prompt: {}", formatted_prompt);

    // Create a channel for token communication
    let (tx, mut rx) = tokio::sync::mpsc::channel::<String>(1000);
    let generated_text = Arc::new(Mutex::new(String::new()));
    let generated_text_clone = Arc::clone(&generated_text);

    // Clone `state` (which is an Arc) to pass it into the async task
    let state_clone = Arc::clone(&state);
    let formatted_prompt_clone = formatted_prompt.clone();

    // Spawn a task to run `infer`
    let infer_handle = tokio::spawn(async move {
        // Lock `textgen` from `state_clone`
        let mut textgen = state_clone.textgen.lock().await;
        let infer_result = textgen
            .infer(&formatted_prompt_clone, sample_len, &tx)
            .await;
        drop(tx); // Close the sender to signal completion
        infer_result
    });

    // Collect tokens concurrently
    let collect_handle = tokio::spawn(async move {
        while let Some(token) = rx.recv().await {
            let mut gen_text = generated_text_clone.lock().await;
            gen_text.push_str(&token);
        }
    });

    // Await both tasks
    let infer_result = infer_handle.await.unwrap();
    collect_handle.await.unwrap();

    // Retrieve the generated text
    let generated_text = Arc::try_unwrap(generated_text)
        .expect("Failed to unwrap Arc")
        .into_inner();

    match infer_result {
        Ok(_) => {
            println!("Generated text successfully: {}", generated_text);

            // Update history
            history.push_back((prompt.clone(), generated_text.clone()));
            if history.len() > MAX_HISTORY {
                history.pop_front();
            }

            println!("Returning generated text to frontend: {}", generated_text);
            Ok(generated_text)
        }
        Err(e) => {
            println!("Error generating text: {:?}", e);
            Err(e.to_string())
        }
    }
}

// Lệnh để xóa lịch sử hội thoại
#[tauri::command]
async fn clear_history(state: State<'_, Arc<AppState>>) -> Result<(), String> {
    let mut history = state.history.lock().await;
    history.clear();
    println!("Chat history cleared");
    Ok(())
}

#[tauri::command]
fn greet(name: &str, email: &str) -> String {
    println!("Inside RUST Code");
    format!("Hello, {}! you are logged in with email {}", name, email)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let (model, tokenizer, device) = loader::model_loader().expect("Không thể tải mô hình");

    // In ra thông tin về device
    println!("Using device: {:?}", device);

    // Khởi tạo đối tượng TextGeneration
    let textgen = textgen::TextGeneration::new(
        model,
        tokenizer,
        device.clone(),
        42,
        Some(0.15),
        Some(0.8),
        None,
        1.2,
        64,
    );

    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");
    let db = Database::connect(db_url)
        .await
        .expect("Database connection failed");

    // Đưa TextGeneration và lịch sử vào State của Tauri
    let state = Arc::new(AppState {
        textgen: Mutex::new(textgen),
        history: Mutex::new(VecDeque::new()), // Khởi tạo `history` trống
        conn: db.into(),
    });

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            greet,
            generate_text,
            clear_history,
            get_dashboard_courses,
            get_purchase,
            get_categories,
            get_search,
            create_course,
            update_course,
            add_attachment,
            remove_attachment
        ]) // Đăng ký lệnh clear_history
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
