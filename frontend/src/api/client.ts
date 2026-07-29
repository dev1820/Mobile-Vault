import axios from "axios";

export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN as string;
export const TOKEN_STORAGE_KEY = "mv_admin_token";

export const apiClient = axios.create({
  baseURL: `${API_ORIGIN}/api`,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      const path = window.location.pathname;
      if (path.startsWith("/admin") && path !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);

export function imageUrl(path: string): string {
  return `${API_ORIGIN}${path}`;
}
