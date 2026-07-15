/**
 * Central networking layer.
 * Currently a scaffold with interceptors, retry, refresh-token, and error-handling
 * placeholders. Services return mock data in dev; replace only the service
 * implementation to switch to a real backend.
 */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  AxiosError,
} from "axios";

export interface ApiEnv {
  baseURL: string;
  timeout: number;
}

const env: ApiEnv = {
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) ?? "/api",
  timeout: 30_000,
};

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("itl.access_token");
}

async function refreshAuthToken(): Promise<string | null> {
  // Placeholder — wire to backend `/auth/refresh` later.
  return null;
}

function createApi(config: Partial<ApiEnv> = {}): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL ?? env.baseURL,
    timeout: config.timeout ?? env.timeout,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use((req) => {
    const token = getAuthToken();
    if (token && req.headers) req.headers.Authorization = `Bearer ${token}`;
    return req;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as AxiosRequestConfig & { _retry?: boolean };

      // 401 → attempt refresh once.
      if (error.response?.status === 401 && original && !original._retry) {
        original._retry = true;
        const fresh = await refreshAuthToken();
        if (fresh && original.headers) {
          original.headers.Authorization = `Bearer ${fresh}`;
          return instance.request(original);
        }
      }

      // Global error toast placeholder — wire to sonner later.
      // toast.error(getErrorMessage(error));

      return Promise.reject(error);
    },
  );

  return instance;
}

export const api = createApi();

/** Simulate a mock async response — replace with real API calls incrementally. */
export function mockResponse<T>(data: T, delay = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

/** Future endpoint namespace map — keep in sync with backend router. */
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    forgot: "/auth/forgot-password",
    reset: "/auth/reset-password",
    verify: "/auth/verify-email",
    otp: "/auth/otp",
  },
  chat: {
    list: "/chat/threads",
    stream: "/chat/stream",
    upload: "/chat/upload",
  },
  admin: {
    metrics: "/admin/metrics",
    users: "/admin/users",
    subs: "/admin/subscriptions",
  },
  ai: {
    complete: "/ai/complete",
    embed: "/ai/embed",
    tools: "/ai/tools",
  },
} as const;
