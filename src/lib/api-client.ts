import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT
apiClient.interceptors.request.use((config) => {
  const { access_token, token_type } = useAuthStore.getState();
  if (access_token && config.headers) {
    const scheme = token_type?.trim() || "bearer";
    config.headers.Authorization = `${scheme} ${access_token}`;
  }
  return config;
});

// Response Interceptor: Handle 401s
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
