import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../auth/token";
import { refresh } from "./auth";

export const userApi = axios.create({
  baseURL: import.meta.env.USER_API_URL?.replace(/\/$/, ''),
});

userApi.interceptors.request.use((config) => {
  const url = config.url ?? "";
  const isAuthEndpoint =
    url.includes("api/auth/login") ||
    url.includes("api/auth/refresh") ||
    url.includes("api/auth/logout");

  if (isAuthEndpoint) {
    return config;
  }

  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

userApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const data = await refresh(refreshToken);

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;

        return userApi(original);
      } catch (err) {
        clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);