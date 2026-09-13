use tauri::command;
use crate::presentation::errors::CommandError;
use crate::presentation::commands::helpers::log_command;

#[command]
pub async fn visit_url(url: String) -> Result<String, CommandError> {
    log_command(format!("visit_url: {}", url));

    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        .build()
        .map_err(|e| CommandError::InternalServerError(format!("Failed to build HTTP client: {e}")))?;

    let mut request = client.get(&url);
    if url.contains("163.com") {
        request = request.header("Referer", "https://music.163.com/");
    }

    let response = request
        .send()
        .await
        .map_err(|e| CommandError::InternalServerError(format!("Failed to visit URL: {e}")))?;

    response
        .text()
        .await
        .map_err(|e| CommandError::InternalServerError(format!("Failed to read response body: {e}")))
}
