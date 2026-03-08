import axios from "axios";
import { Note } from "../types/types";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${import.meta.env.VITE_MOCK_TOKEN}`
  }
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