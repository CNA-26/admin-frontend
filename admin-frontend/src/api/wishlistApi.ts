import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../auth/token";
import { refresh } from "./auth";

const baseUrl = import.meta.env.WISHLIST_API_URL?.replace(/\/$/, '');
console.log("[wishlistApi] baseURL:", baseUrl);
console.log("[wishlistApi] WISHLIST_API_URL env:", import.meta.env.WISHLIST_API_URL);

export const wishlistApi = axios.create({
  baseURL: baseUrl,
});

wishlistApi.interceptors.request.use((config) => {
  const url = config.url ?? "";
  
  // Don't add auth header for stats endpoint
  if (url.includes("wishlist/stats")) {
    return config;
  }

  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

wishlistApi.interceptors.response.use(
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

        return wishlistApi(original);
      } catch (err) {
        clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
