import { invoke } from "@tauri-apps/api/core";
import { Nota } from "../types/types";

export const API = {
  salvaNota: async (titolo: string, descrizione: string): Promise<Nota> => {
    return await invoke("salva_nota", { titolo, descrizione });
  },
  
  caricaNote: async (): Promise<Nota[]> => {
    // Chiama il comando Rust che interrogherà il DB Go/PostgreSQL
    return await invoke("carica_note"); 
  },
};