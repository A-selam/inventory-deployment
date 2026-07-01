import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@/types/auth";

type LoggedRequestConfig = InternalAxiosRequestConfig & {
  metadata?: {
    startedAt: number;
  };
  _authRetry?: boolean;
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

type RefreshTokenPayload = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: unknown;
};

function isUser(value: unknown): value is User {
  if (!value || typeof value !== "object") return false;
  const raw = value as Partial<User>;
  return (
    typeof raw.id === "string" &&
    typeof raw.name === "string" &&
    typeof raw.email === "string" &&
    (raw.role === "admin" || raw.role === "operator" || raw.role === "viewer")
  );
}

function isAuthEndpoint(url: string | undefined) {
  if (!url) return false;
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/refresh-token") ||
    url.includes("/auth/setup-password")
  );
}

function normalizeRefreshTokenPayload(payload: unknown): RefreshTokenPayload {
  if (payload && typeof payload === "object") {
    const raw = payload as Partial<RefreshTokenPayload> & { data?: unknown };
    const rawData = raw.data as Partial<RefreshTokenPayload> | undefined;

    const access_token =
      typeof rawData?.access_token === "string"
        ? rawData.access_token
        : typeof raw.access_token === "string"
          ? raw.access_token
          : undefined;
    const token_type =
      typeof rawData?.token_type === "string"
        ? rawData.token_type
        : typeof raw.token_type === "string"
          ? raw.token_type
          : "bearer";
    const refresh_token =
      typeof rawData?.refresh_token === "string"
        ? rawData.refresh_token
        : typeof raw.refresh_token === "string"
          ? raw.refresh_token
          : undefined;
    const user =
      typeof rawData?.user === "object"
        ? rawData.user
        : typeof raw.user === "object"
          ? raw.user
          : undefined;

    if (access_token && refresh_token && user) {
      return { access_token, refresh_token, token_type, user };
    }
  }

  throw new Error("Invalid refresh token response");
}

const refreshClient = axios.create({
  baseURL: apiClient.defaults.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<RefreshTokenPayload> | null = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  const { refresh_token } = useAuthStore.getState();
  if (!refresh_token) {
    throw new Error("Missing refresh token");
  }

  refreshPromise = refreshClient
    .post("/auth/refresh-token", { refresh_token })
    .then((res) => normalizeRefreshTokenPayload(res.data as unknown))
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

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
  async (error) => {
    logApiError(error);

    const status = error.response?.status;
    const originalConfig = error.config as LoggedRequestConfig | undefined;

    if (
      originalConfig &&
      (status === 401 || status === 403) &&
      !originalConfig._authRetry &&
      !isAuthEndpoint(originalConfig.url)
    ) {
      originalConfig._authRetry = true;

      const {
        persistSession,
        user: existingUser,
        setAuth,
        logout,
      } = useAuthStore.getState();

      try {
        const refreshed = await refreshAccessToken();

        const nextUser = isUser(refreshed.user) ? refreshed.user : existingUser;

        if (!nextUser) {
          logout();
          if (typeof window !== "undefined") window.location.href = "/login";
          return Promise.reject(error);
        }

        setAuth(
          refreshed.access_token,
          refreshed.token_type,
          refreshed.refresh_token,
          nextUser,
          persistSession,
        );

        if (originalConfig.headers) {
          const scheme = refreshed.token_type?.trim() || "bearer";
          originalConfig.headers.Authorization = `${scheme} ${refreshed.access_token}`;
        }

        return apiClient(originalConfig);
      } catch (refreshError) {
        logout();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
