import axios from "axios";
import { getToken, clearAuth } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// Attach the admin JWT (if present) to every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Session expired / unauthenticated. Clear stale creds and bounce to the
      // login page — but never redirect-loop the login page itself.
      const onAuthPage = window.location.pathname.startsWith("/auth");
      if (!onAuthPage) {
        clearAuth();
        const next = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        window.location.href = `/auth?next=${next}`;
      }
    }
    return Promise.reject(error);
  },
);

export const useApi = () => api;
export { api };
export default api;
