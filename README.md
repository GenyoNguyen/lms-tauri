# Study_App

**Study_App** là một ứng dụng học tập với các khóa học đa dạng và một chatbot thông minh, giúp người dùng giải đáp các câu hỏi trong quá trình học. Ứng dụng còn tích hợp chức năng hỗ trợ xem và ghi chú PDF kèm chatbot, giúp tăng cường trải nghiệm học tập.

## Các tính năng chính
- **Khóa học đa dạng:** Người dùng có thể tiếp cận các khóa học thuộc nhiều lĩnh vực khác nhau.
- **Chatbot thông minh:** Trợ lý AI giúp trả lời các câu hỏi liên quan đến khóa học, nâng cao hiệu quả học tập.
- **Chế độ PDF kèm chatbot:** Xem và tương tác trực tiếp trên file PDF với sự hỗ trợ của chatbot, giúp người dùng dễ dàng ghi chú và tìm kiếm thông tin.

## Demo
- 3 Hình ảnh demo của ứng dụng: 
![Prompt của chatbot](https://github.com/GenyoNguyen/lms-tauri/blob/main/pic/Chatbot_prompt.png?raw=true)
![Giao diện chính](https://github.com/GenyoNguyen/lms-tauri/blob/main/pic/Giao%20di%E1%BB%87n%20ch%C3%ADnh.png?raw=true)
![Prompt của chatbot trong chế độ đọc pdf](https://github.com/GenyoNguyen/lms-tauri/blob/main/pic/Prompt_PDF.png?raw=true)
- **1 video** minh họa cách sử dụng chatbot và chế độ PDF:
![demo](https://github.com/GenyoNguyen/lms-tauri/blob/main/pic/demo1.mp4?raw=true)

## Hướng dẫn cài đặt

### Bước 1: Tải file cài đặt

1. Tải file `.exe` từ liên kết Google Drive dưới đây:
   - [Tải Study_App](https://drive.google.com/drive/folders/1WYEMHdJcDHV5uSnNVCC0qT-Pml6XSoyq?usp=sharing)
     
   > **Lưu ý**: Đảm bảo rằng bạn có kết nối mạng ổn định khi tải xuống.

2. Sau khi tải xuống, mở file `.exe` và làm theo các bước cài đặt trên màn hình để hoàn tất quá trình.

### Bước 2: Cài đặt NVIDIA Toolkit (dành cho người dùng có GPU)

Nếu bạn có GPU của NVIDIA và muốn tận dụng sức mạnh tính toán để tăng tốc hiệu suất ứng dụng, hãy cài đặt **NVIDIA CUDA Toolkit** theo các bước sau:

1. Truy cập trang tải **NVIDIA CUDA Toolkit**:
   - [Tải NVIDIA CUDA Toolkit](https://developer.nvidia.com/cuda-downloads)

2. Chọn phiên bản tương thích với hệ điều hành của bạn, tải về và cài đặt theo hướng dẫn trên trang của NVIDIA.

3. Sau khi cài đặt xong, kiểm tra cài đặt thành công bằng lệnh sau trong terminal:

   ```bash
   nvcc --version

## Các bước để vào chế độ dev: 
### Yêu cầu hệ thống

Để cài đặt và chỉnh sửa **Study_App**, bạn cần đảm bảo hệ thống đáp ứng các yêu cầu sau:

- **Node.js** phiên bản 14 trở lên
- **NPM** phiên bản 6 trở lên
- **Rush** để quản lý các dự án lớn với nhiều package. Bạn có thể cài đặt Rush trên trang web chính thức.
- **Tauri** để xây dựng ứng dụng cross-platform native. Đảm bảo bạn cài đặt Tauri CLI:
  ```bash
  cargo install tauri-cli
  ```
- **GPU Toolkit** (dành cho người dùng có GPU NVIDIA) – Cài đặt NVIDIA CUDA Toolkit để tận dụng GPU tăng tốc cho ứng dụng. Bạn có thể tải về từ [NVIDIA CUDA Toolkit](https://developer.nvidia.com/cuda-downloads).

### Các bước thực hiện:
1. Clone repo:
    ```bash
    git clone https://github.com/username/Study_App.git
    ```
2. Di chuyển vào thư mục dự án:
    ```bash
    cd Study_App
    ```
3. Ở chế độ dev:
   ```bash
   code .
   ```
5. Cài đặt các thư viện cần thiết:
    ```bash
    npm install
    ```
6. Khởi động ứng dụng:
    ```bash
    npx tauri dev
    ```
7. Build ứng dụng:
   ```bash
   npx tauri build
   ```

## Cách sử dụng
1. Truy cập vào danh mục khóa học để chọn khóa học mong muốn.
2. Khi cần trợ giúp, mở chatbot để đặt câu hỏi liên quan đến nội dung học.
3. Để học tập trên tài liệu PDF, mở chức năng PDF kèm chatbot để tương tác và ghi chú.

## Đóng góp
Chúng tôi hoan nghênh mọi ý kiến đóng góp! Vui lòng tạo pull request hoặc mở issue nếu bạn có đề xuất về tính năng mới hoặc phát hiện lỗi.

## Liên hệ
Mọi thắc mắc hoặc ý kiến xin gửi về [nguyenxuanphuc010205@gmail.com](nguyenxuanphuc010205@gmail.com)
