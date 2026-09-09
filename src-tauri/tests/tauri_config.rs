//! Gate de consistencia del release: `tauri.conf.json` vs `Cargo.toml`.
//! Corre headless con `cargo test` (sin webview ni display).
//!
//! Crates de assertions elegidos:
//! - `pretty_assertions`: diff legible en assert_eq.
//! - `assert2`: `assert!`/`check!` con rendering de la expresión.
//! - `static_assertions`: gates en tiempo de compilación (Send+Sync del
//!   metadata que viajará a Tauri State en el futuro).
//! Fuera a propósito: `asserting` (API fluida por traits, se solapa con los
//! tres anteriores sin aporte) y `thirtyfour` (cliente WebDriver en Rust que
//! exige runtime tokio + driver + display; el E2E oficial va por WebdriverIO).

use pretty_assertions::assert_eq;
use static_assertions::assert_impl_all;

#[derive(Debug, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct AppMeta {
    product_name: String,
    version: String,
    identifier: String,
}

// El metadata debe poder cruzar hilos (requisito de Tauri State).
assert_impl_all!(AppMeta: Send, Sync);

#[test]
fn tauri_config_matches_cargo_package() {
    let raw = include_str!("../tauri.conf.json");
    let meta: AppMeta =
        serde_json::from_str(raw).expect("tauri.conf.json debe ser JSON válido");

    assert2::assert!(
        !meta.product_name.trim().is_empty(),
        "productName vacío en tauri.conf.json"
    );
    assert_eq!(
        meta.version,
        env!("CARGO_PKG_VERSION"),
        "la version de tauri.conf.json debe igualar la de Cargo.toml"
    );
    assert2::check!(
        meta.identifier.contains('.'),
        "identifier debe ser DNS reverso, ej. com.ejemplo.app"
    );
}
