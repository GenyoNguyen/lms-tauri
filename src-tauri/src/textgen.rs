use anyhow::Error;
use tokio::sync::mpsc::Sender;

use candle_core::{Device, Tensor};
use candle_examples::token_output_stream::TokenOutputStream;
use candle_transformers::generation::{LogitsProcessor, Sampling};
use candle_transformers::models::quantized_llama::ModelWeights;
use tokenizers::Tokenizer;

pub struct TextGeneration {
    model: ModelWeights,
    tokenizer: TokenOutputStream,
    device: Device,
    logits_processor: LogitsProcessor,
    repeat_penalty: f32,
    repeat_last_n: usize,
}

impl TextGeneration {
    pub fn new(
        model: ModelWeights,
        tokenizer: Tokenizer,
        device: Device,
        seed: u64,
        temp: Option<f64>,
        top_p: Option<f64>,
        top_k: Option<usize>,
        repeat_penalty: f32,
        repeat_last_n: usize,
    ) -> Self {
        let logits_processor = {
            let temperature = temp.unwrap_or(0.);
            let sampling = if temperature <= 0. {
                Sampling::ArgMax
            } else {
                match (top_k, top_p) {
                    (None, None) => Sampling::All { temperature },
                    (Some(k), None) => Sampling::TopK { k, temperature },
                    (None, Some(p)) => Sampling::TopP { p, temperature },
                    (Some(k), Some(p)) => Sampling::TopKThenTopP { k, p, temperature },
                }
            };
            LogitsProcessor::from_sampling(seed, sampling)
        };

        Self {
            model,
            tokenizer: TokenOutputStream::new(tokenizer),
            logits_processor,
            repeat_penalty,
            repeat_last_n,
            device,
        }
    }

    pub async fn infer(
        &mut self,
        prompt: &str,
        sample_len: usize,
        tx: &Sender<String>,
    ) -> Result<String, Error> {
        println!("Starting inference with prompt: {}", prompt);
        println!("Using device: {:?}", self.device);

        let mut inference = String::new();

        // Bước 1: Xóa các token cũ trong tokenizer
        self.tokenizer.clear();
        let mut tokens = self
            .tokenizer
            .tokenizer()
            .encode(prompt, true)
            .map_err(|e| Error::msg(e))?
            .get_ids()
            .to_vec();
        println!("Initial tokens from prompt: {:?}", tokens);

        let mut generated_tokens = 0usize;
        let eos_token = match self.tokenizer.get_token("</s>") {
            Some(token) => token,
            None => {
                println!("Error: Cannot find eos token - </s>");
                return Err(Error::msg("Cannot find eos token - </s>".to_string()));
            }
        };

        println!("\n> Generating tokens");
        let start_gen = std::time::Instant::now();
        for index in 0..sample_len {
            // Bước 2: Xác định kích thước ngữ cảnh
            let context_size = if index > 0 { 1 } else { tokens.len() };
            let start_pos = tokens.len().saturating_sub(context_size);
            let context = &tokens[start_pos..];
            println!("Context tokens (step {}): {:?}", index, context);

            // Bước 3: Tạo tensor đầu vào từ ngữ cảnh
            let input = Tensor::new(context, &self.device)?.unsqueeze(0)?;
            println!("Tensor device: {:?}", input.device());

            // Bước 4: Suy luận (forward pass)
            let logits = &mut self.model.forward(&input, start_pos)?;
            let logits = logits.squeeze(0)?.squeeze(0)?;
            println!("Logits after forward pass (step {}): {:?}", index, logits);

            // Bước 5: Áp dụng repeat penalty nếu có
            let logits = if self.repeat_penalty == 1. {
                logits
            } else {
                let start_at = tokens.len().saturating_sub(self.repeat_last_n);
                println!("Applying repeat penalty from position {}", start_at);
                candle_transformers::utils::apply_repeat_penalty(
                    &logits,
                    self.repeat_penalty,
                    &tokens[start_at..],
                )?
            };

            // Bước 6: Chọn token tiếp theo
            let next_token = self.logits_processor.sample(&logits)?;
            println!("Next token (step {}): {:?}", index, next_token);
            tokens.push(next_token);
            generated_tokens += 1;

            // Kiểm tra nếu token là end-of-sequence (kết thúc)
            if next_token == eos_token {
                println!("EOS token: {:?}", eos_token);
                println!("End-of-sequence token reached at step {}", index);
                break;
            }

            // Chuyển token thành từ và gửi qua channel
            if let Some(t) = self.tokenizer.next_token(next_token)? {
                println!("Generated token text (step {}): {}", index, t);
                inference.push_str(&t);
                tx.send(t).await.expect("Issue sending on channel");
                println!("Token sent successfully for step {}", index);
            }
        }

        // Tính thời gian và in kết quả
        let dt = start_gen.elapsed();
        if let Some(rest) = self.tokenizer.decode_rest().map_err(|e| Error::msg(e))? {
            println!("Remaining text after decoding: {}", rest);
            inference.push_str(&rest);
            tx.send(rest).await.expect("Issue sending on channel");
        }

        println!(
            "> {} tokens generated ({:.2} tokens/s)",
            generated_tokens,
            generated_tokens as f64 / dt.as_secs_f64(),
        );

        println!("Final generated text: {}", inference);
        Ok(inference)
    }
}
