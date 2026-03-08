import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

// ─── Config ────────────────────────────────────────────────────────────────

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

// ─── Storage helpers ───────────────────────────────────────────────────────

export const storage = {
  get: (key: string) => SecureStore.getItemAsync(key),
  set: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  delete: (key: string) => SecureStore.deleteItemAsync(key),
};

// ─── Istanza Axios ─────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

// ─── Interceptor request: inietta il Bearer token ──────────────────────────

const API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? "6aa15e2166e098199d727031d816ff1d9749258aa74b9de3b6ed9721501eeefc";

apiClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${API_KEY}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Interceptor response: gestione token scaduto (401) ───────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.get("refresh_token");

        if (!refreshToken) throw new Error("No refresh token");

        // Chiama il tuo endpoint di refresh
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        await storage.set("access_token", data.access_token);

        // Riprova la richiesta originale con il nuovo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        }

        return apiClient(originalRequest);
      } catch {
        // Refresh fallito → logout
        await storage.delete("access_token");
        await storage.delete("refresh_token");
        router.replace("/");
      }
    }

    return Promise.reject(error);
  }
);

// ─── Helper tipizzati ──────────────────────────────────────────────────────

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.get(url, config);
  return response.data;
}

async function post<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.post(url, body, config);
  return response.data;
}

async function put<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.put(url, body, config);
  return response.data;
}

async function patch<T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.patch(url, body, config);
  return response.data;
}

async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.delete(url, config);
  return response.data;
}

export const api = { get, post, put, patch, delete: del };
export default apiClient;

// ─── Esempio d'uso ─────────────────────────────────────────────────────────
//
// import { api } from "@/lib/api";
//
// type User = { id: string; name: string; email: string };
//
// // GET
// const user = await api.get<User>("/users/me");
//
// // POST
// const newUser = await api.post<User, { name: string; email: string }>(
//   "/users",
//   { name: "Marco", email: "marco@example.com" }
// );
//
// // PUT
// await api.put<User, Partial<User>>("/users/123", { name: "Marco P." });
//
// // PATCH
// await api.patch<User, Partial<User>>("/users/123", { email: "new@email.com" });
//
// // DELETE
// await api.delete<void>("/users/123");
