import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/auth-store";

type LoggedRequestConfig = InternalAxiosRequestConfig & {
  metadata?: {
    startedAt: number;
  };
};

const shouldLogApiResponses = process.env.NODE_ENV !== "production";

function logApiResponse(response: AxiosResponse) {
  if (!shouldLogApiResponses) return;

  const config = response.config as LoggedRequestConfig;
  const durationMs = config.metadata?.startedAt
    ? Date.now() - config.metadata.startedAt
    : undefined;

  console.log("[api:response]", {
    method: config.method?.toUpperCase() ?? "GET",
    url: config.baseURL ? `${config.baseURL}${config.url ?? ""}` : config.url,
    status: response.status,
    durationMs,
    data: response.data,
  });
}

function logApiError(error: unknown) {
  if (!shouldLogApiResponses || !axios.isAxiosError(error)) return;

  const config = error.config as LoggedRequestConfig | undefined;

  console.error("[api:error]", {
    method: config?.method?.toUpperCase() ?? "GET",
    url: config?.baseURL ? `${config.baseURL}${config.url ?? ""}` : config?.url,
    status: error.response?.status,
    data: error.response?.data,
    message: error.message,
  });
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT
apiClient.interceptors.request.use((config: LoggedRequestConfig) => {
  config.metadata = {
    startedAt: Date.now(),
  };

  const { access_token, token_type } = useAuthStore.getState();
  if (access_token && config.headers) {
    const scheme = token_type?.trim() || "bearer";
    config.headers.Authorization = `${scheme} ${access_token}`;
  }
  return config;
});

// Response Interceptor: Handle 401s
apiClient.interceptors.response.use(
  (response) => {
    logApiResponse(response);

    const payload = response.data as unknown;
    if (payload && typeof payload === "object" && "success" in payload) {
      const success = (payload as { success?: unknown }).success;
      if (success === false) {
        const code =
          typeof (payload as { error?: { code?: unknown } }).error?.code ===
          "string"
            ? ((payload as { error?: { code?: string } }).error?.code as string)
            : "API_ERROR";

        const message =
          typeof (payload as { error?: { message?: unknown } }).error
            ?.message === "string"
            ? ((payload as { error?: { message?: string } }).error
                ?.message as string)
            : "Request failed";

        const businessError = new AxiosError(
          message,
          code,
          response.config,
          response.request,
          response,
        );

        logApiError(businessError);
        return Promise.reject(businessError);
      }
    }

    return response;
  },
  (error) => {
    logApiError(error);

    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
