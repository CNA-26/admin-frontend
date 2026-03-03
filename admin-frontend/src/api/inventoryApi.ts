import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../auth/token";
import { refresh } from "./auth";

export const inventoryApi = axios.create({
  baseURL: import.meta.env.INVENTORY_API_URL?.replace(/\/$/, ''),
});

inventoryApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

inventoryApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const message = String(error.response?.data?.message ?? "").toLowerCase();
    const shouldRefresh =
      status === 401 ||
      (status === 403 && (message.includes("invalid") || message.includes("expired")));

    if (shouldRefresh && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const data = await refresh(refreshToken);

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        if (original.params?.accessToken) {
          original.params.accessToken = data.accessToken;
        }
        if (original.data?.accessToken) {
          original.data.accessToken = data.accessToken;
        }

        return inventoryApi(original);
      } catch (err) {
        clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
