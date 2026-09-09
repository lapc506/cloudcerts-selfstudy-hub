#[cfg_attr(mobile, tauri::mobile_entry_point)]

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        // Requerido por @wdio/tauri-service (mock/log forwarding en E2E).
        // Ref: https://webdriver.io/docs/desktop-testing/tauri/plugin-setup
        .plugin(tauri_plugin_wdio::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
