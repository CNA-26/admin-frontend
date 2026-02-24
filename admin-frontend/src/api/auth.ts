import axios from "axios";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

// Create a separate axios instance for auth endpoints with no interceptors
const authClient = axios.create({
  baseURL: import.meta.env.USER_API_URL?.replace(/\/$/, ''),
});

export async function login(email: string, password: string) {
  const res = await authClient.post("api/auth/login", { email, password });
  return res.data as LoginResponse;
}

export async function refresh(refreshToken: string) {
  const res = await authClient.post("api/auth/refresh", { refreshToken });
  return res.data as LoginResponse;
}

export async function logout(refreshToken: string) {
  await authClient.post("api/auth/logout", { refreshToken });
}