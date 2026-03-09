import axios from "axios";
import { Note } from "../types/types";

// Funzioni per leggere i dati salvati nel browser
const getStoredUrl = () => localStorage.getItem("appunto_api_url") || "";
const getStoredToken = () => localStorage.getItem("appunto_api_token") || "";

const apiClient = axios.create();

// "Intercettiamo" ogni chiamata prima che parta per iniettare l'URL e il Token aggiornati
apiClient.interceptors.request.use((config) => {
  config.baseURL = getStoredUrl();
  config.headers.Authorization = `Bearer ${getStoredToken()}`;
  return config;
});

export const API = {
  createNote: async (title: string, content: string): Promise<Note> => {
    const response = await apiClient.post("/notes", { title, content, tags: [] });
    return response.data;
  },

  getNotes: async (): Promise<Note[]> => {
    const response = await apiClient.get("/notes");
    return response.data;
  },

  updateNote: async (id: string, title: string, content: string): Promise<Note> => {
    const response = await apiClient.put(`/notes/${id}`, { title, content, tags: [] });
    return response.data;
  },

  deleteNote: async (id: string): Promise<void> => {
    await apiClient.delete(`/notes/${id}`);
  }
};