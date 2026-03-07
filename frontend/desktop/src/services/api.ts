import { invoke } from "@tauri-apps/api/core";
import { Nota } from "../types/types";

// Tutte le funzioni che parlano con il database/Rust andranno qui
export const API = {
  salvaNota: async (titolo: string, descrizione: string): Promise<Nota> => {
    return await invoke("salva_nota", { titolo, descrizione });
  },
  // In futuro aggiungeremo qui: caricaNote, eliminaNota, ecc.
};