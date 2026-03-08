import storage from "@/services/storage";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { router } from "expo-router";

// ─── Storage keys (devono combaciare con ip.tsx) ───────────────────────────

export const STORAGE_KEYS = {
  SERVER_IP: "folio_server_ip",
  API_KEY: "folio_api_key",
} as const;

// ─── Istanza Axios (baseURL placeholder, viene sovrascritta nell'interceptor) ──

const apiClient: AxiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// ─── Interceptor request: legge IP e API key dallo storage ─────────────────

apiClient.interceptors.request.use(
  async (config) => {
    const [serverIp, apiKey] = await Promise.all([
      storage.get(STORAGE_KEYS.SERVER_IP),
      storage.get(STORAGE_KEYS.API_KEY),
    ]);

    if (serverIp) {
      // Costruisce la baseURL dinamicamente ad ogni richiesta
      config.baseURL = `http://${serverIp}/api/v1`;
    }

    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Interceptor response: gestione errori ─────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Server non raggiungibile
    if (!error.response) {
      return Promise.reject(new Error("Server non raggiungibile. Controlla l'indirizzo IP."));
    }

    // API key non valida → torna alla configurazione
    if (error.response.status === 401) {
      await storage.delete(STORAGE_KEYS.SERVER_IP);
      await storage.delete(STORAGE_KEYS.API_KEY);
      router.replace("/");
    }

    return Promise.reject(error);
  }
);

// ─── Helper tipizzati ──────────────────────────────────────────────────────

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.get(url, config);
  return response.data;
}

async function post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.post(url, body, config);
  return response.data;
}

async function put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.put(url, body, config);
  return response.data;
}

async function patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.patch(url, body, config);
  return response.data;
}

async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.delete(url, config);
  return response.data;
}

export const api = { get, post, put, patch, delete: del };
export default apiClient;
