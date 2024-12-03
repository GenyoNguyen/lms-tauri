use sea_orm::{Database, DatabaseConnection};
use std::collections::VecDeque;
use std::sync::Arc;
use tauri::State;
use tokio::sync::Mutex;

use dotenv::dotenv;
use std::env;
mod loader;
mod textgen;

mod api;
use api::*;

const CHAT_TEMPLATE_CHAT_BOT: &str = "[INST] Bạn tên là Ps Retrov, giáo viên tư vấn học tập cho học sinh nhỏ tuổi, tinh thần thoải mái. 
- Không lặp lại câu trả lời, không lặp lại câu hỏi của người dùng.
- Chỉ trả lời thông tin mới khi được yêu cầu.
- Không đặt câu hỏi hay thêm thông tin không được yêu cầu.
- Nếu người dùng chào, hãy chào vui vẻ và không đặt câu hỏi.
- Không gửi URL.
Hãy trả lời trung thực, chính xác, ngắn gọn, đúng trọng tâm, vui vẻ và thêm icon phù hợp. 😊 [/INST]";
const CHAT_TEMPLATE_PDF: &str = "[INST] Bạn là một người trợ giúp người dùng trả lời các thắc mắc khi đọc tài liệu học tập. Hãy đưa ra những thông tin chính xác nhất về vấn đề người dùng hỏi [/INST]";
const MAX_HISTORY: usize = 20; // Giới hạn lịch sử hội thoại

// Cấu trúc AppState
pub struct AppState {
    pub textgen: Mutex<Option<textgen::TextGeneration>>, // Chứa mô hình nếu đã tải
    pub history: Mutex<VecDeque<(String, String)>>,      // Lịch sử hội thoại
    pub conn: Mutex<DatabaseConnection>,
    pub model_loaded: Mutex<bool>, // Đánh dấu mô hình đã tải
}

// Hàm định dạng prompt với CHAT_TEMPLATE và history
fn format_prompt(new_prompt: &str, history: &VecDeque<(String, String)>, is_chat: bool) -> String {
    // Xây dựng chuỗi lịch sử từ VecDeque
    let history_str = history
        .iter()
        .map(|(user_prompt, model_response)| {
            format!("[INST] {} [/INST] {} </s>", user_prompt, model_response)
        })
        .collect::<Vec<String>>()
        .join(" ");

    // Format chuỗi dựa trên kiểu trò chuyện hay truy vấn PDF
    if is_chat {
        // Trò chuyện: Sử dụng CHAT_TEMPLATE_CHAT_BOT
        format!(
            "{} {} [INST] {} [/INST]",
            CHAT_TEMPLATE_CHAT_BOT, history_str, new_prompt
        )
    } else {
        // Truy vấn PDF: Sử dụng CHAT_TEMPLATE_PDF
        format!(
            "{} {} [INST] {} [/INST]",
            CHAT_TEMPLATE_PDF, history_str, new_prompt
        )
    }
}

#[tauri::command]
async fn generate_text(
    prompt: String,
    sample_len: usize,
    state: State<'_, Arc<AppState>>,
    style: bool,
) -> Result<String, String> {
    println!("Received prompt: {}", prompt);

    // Kiểm tra xem mô hình đã được tải chưa
    let mut model_loaded = state.model_loaded.lock().await;

    // Nếu mô hình chưa tải, tải mô hình và khởi tạo TextGeneration
    if !*model_loaded {
        println!("Loading model...");

        // Tải mô hình tại thời điểm này
        let (model, tokenizer, device) = loader::model_loader().expect("Không thể tải mô hình");

        // Khởi tạo đối tượng TextGeneration
        let textgen = textgen::TextGeneration::new(
            model,
            tokenizer,
            device.clone(),
            42,
            Some(0.1),
            Some(0.5),
            None,
            1.0,
            64,
        );

        // Lưu mô hình vào AppState
        let mut textgen_lock = state.textgen.lock().await;
        *textgen_lock = Some(textgen);

        // Đánh dấu mô hình đã tải
        *model_loaded = true;
        println!("Model loaded successfully");
    }

    // Lấy đối tượng TextGeneration đã tải
    let _textgen = state
        .textgen
        .lock()
        .await
        .as_mut()
        .ok_or("Model not loaded")?;
    let textgen = state
        .textgen
        .lock()
        .await
        .as_mut()
        .ok_or("Model not loaded")?;

    // Acquire history lock
    let mut history = state.history.lock().await;

    // Format the prompt
    let formatted_prompt = format_prompt(&prompt, &history, style);
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
            .as_mut()
            .unwrap() // Chắc chắn đã có mô hình
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
    dotenv().ok();
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");
    let db = Database::connect(db_url)
        .await
        .expect("Database connection failed");

    // Đưa TextGeneration và lịch sử vào State của Tauri
    let state = Arc::new(AppState {
        textgen: Mutex::new(None), // TextGeneration không có mô hình ban đầu
        history: Mutex::new(VecDeque::new()), // Khởi tạo `history` trống
        conn: db.into(),
        model_loaded: Mutex::new(false), // Đánh dấu mô hình chưa được tải
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
            course_checkout,
            create_course,
            update_course,
            list_courses,
            add_attachment,
            remove_attachment,
            delete_course,
            publish_course,
            unpublish_course,
            get_course,
            get_course_with_chapters_with_progress,
            get_progress_percentage,
            get_chapter,
            delete_chapter,
            publish_chapter,
            unpublish_chapter,
            update_chapter_progress,
            reorder_chapters,
            create_chapter,
            update_chapter,
            get_teacher_course,
            get_teacher_chapter,
            get_teacher_analytics
        ])
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
