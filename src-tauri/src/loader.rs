//It is used to load the model and tokenizer from the file system. The model is loaded from the MODEL_PATH environment variable, and the tokenizer is loaded from the TOKENIZER_PATH environment variable. The model is loaded using the gguf_file crate, and the tokenizer is loaded using the tokenizers crate. The model is loaded using the ModelWeights struct from the candle_transformers crate, and the tokenizer is loaded using the Tokenizer struct from the tokenizers crate. The device is created using the Device struct from the candle_core crate. The model_loader function returns a Result containing the model, tokenizer, and device, or an error if loading the model or tokenizer fails. The format_size function is used to format the size of the model in bytes.
use anyhow::Error as E;
use candle_core::{quantized::gguf_file, utils::metal_is_available, Device};
use candle_transformers::models::quantized_llama::ModelWeights;
use dotenv::{dotenv, var};
use tokenizers::Tokenizer;

pub fn model_loader() -> Result<(ModelWeights, Tokenizer, Device), E> {
    // Đảm bảo biến môi trường đã được tải
    dotenv().ok();

    let model_path = var("MODEL_PATH").expect("MODEL_PATH is not set");
    let mut file = std::fs::File::open(&model_path)?;
    let model = gguf_file::Content::read(&mut file).map_err(|e| e.with_path(model_path))?;

    let mut total_size_in_bytes = 0;
    for (_, tensor) in model.tensor_infos.iter() {
        let elem_count = tensor.shape.elem_count();
        total_size_in_bytes +=
            elem_count * tensor.ggml_dtype.type_size() / tensor.ggml_dtype.block_size();
    }

    let device = if metal_is_available() {
        Device::new_metal(0)?
    } else {
        Device::cuda_if_available(0)?
    };

    println!(
        "\n> Loading {:?} tensors - {}",
        model.tensor_infos.len(),
        &format_size(total_size_in_bytes),
    );
    let model = ModelWeights::from_gguf(model, &mut file, &device)?;
    println!("> Successfully loaded tensors ✓");

    let tokenizer_path = var("TOKENIZER_PATH").expect("TOKENIZER_PATH is not set");
    let tokenizer_filename = std::path::PathBuf::from(tokenizer_path);

    println!("\n> Loading tokenizer");
    let tokenizer = Tokenizer::from_file(tokenizer_filename).map_err(E::msg)?;
    println!("> Successfully loaded tokenizer ✓\n");

    Ok((model, tokenizer, device))
}

fn format_size(size_in_bytes: usize) -> String {
    if size_in_bytes < 1_000 {
        format!("{}B", size_in_bytes)
    } else if size_in_bytes < 1_000_000 {
        format!("{:.2}KB", size_in_bytes as f64 / 1e3)
    } else if size_in_bytes < 1_000_000_000 {
        format!("{:.2}MB", size_in_bytes as f64 / 1e6)
    } else {
        format!("{:.2}GB", size_in_bytes as f64 / 1e9)
    }
}
