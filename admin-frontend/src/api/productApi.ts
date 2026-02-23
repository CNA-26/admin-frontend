import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../auth/token";

export const productApi = axios.create({
  baseURL: import.meta.env.PRODUCT_API_URL,
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
        if (!refreshToken) throw new Error("No refresh token");

        const refreshRes = await axios.post(
          `${import.meta.env.USER_API_URL}/api/auth/refresh`,
          { refreshToken }
        );
        const data = refreshRes.data as { accessToken: string; refreshToken: string };

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;

        return productApi(original);
      } catch (err) {
        clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
