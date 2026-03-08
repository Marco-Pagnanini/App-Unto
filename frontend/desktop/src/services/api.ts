import { Note } from "../types/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MOCK_TOKEN = import.meta.env.VITE_MOCK_TOKEN;

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${MOCK_TOKEN}`
});

export const API = {
  createNote: async (title: string, content: string): Promise<Note> => {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ title, content, tags: [] }),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  },

  getNotes: async (): Promise<Note[]> => {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  },

  updateNote: async (id: string, title: string, content: string): Promise<Note> => {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ title, content, tags: [] }),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return await response.json();
  },

  deleteNote: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`API Error: ${response.statusText}`);
    }
  }
};