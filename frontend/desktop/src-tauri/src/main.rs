use serde::{Deserialize, Serialize};

// Definiamo la struttura della nostra Nota (come una tabella del DB)
#[derive(Serialize, Deserialize)]
struct Nota {
    id: String,
    titolo: String,
    descrizione: String,
}

// Questa funzione ora restituisce un oggetto Nota, non più un testo
#[tauri::command]
fn salva_nota(titolo: String, descrizione: String) -> Nota {
    // Qui in futuro metteremo il codice per salvare nel vero Database (es. SQLite)
    println!("Salvando nel DB finto... Titolo: {}", titolo);
    
    // Per ora, creiamo una nota con un ID casuale e la restituiamo a React
    Nota {
        id: format!("nota_{}", std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis()),
        titolo,
        descrizione,
    }
}

// In futuro aggiungeremo anche un comando: fn carica_note() -> Vec<Nota>

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![salva_nota])
        .run(tauri::generate_context!())
        .expect("Errore durante l'avvio dell'app Tauri");
}