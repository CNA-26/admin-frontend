import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../auth/token";
import { refresh } from "./auth";

export const productApi = axios.create({
  baseURL: import.meta.env.PRODUCT_API_URL?.replace(/\/$/, ''),
});

productApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

productApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = getRefreshToken();
        console.log("[productApi] Attempting refresh with token:", refreshToken?.substring(0, 20) + "...");
        
        if (!refreshToken) throw new Error("No refresh token");

        const data = await refresh(refreshToken);
        console.log("[productApi] Refresh successful");

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;

        return productApi(original);
      } catch (err: any) {
        console.error("[productApi] Refresh failed:", err.response?.status, err.response?.data);
        clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
