import { userApi } from "./userApi";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function login(email: string, password: string) {
  const res = await userApi.post("/api/auth/login", { email, password });
  return res.data as LoginResponse;
}

export async function refresh(refreshToken: string) {
  const res = await userApi.post("/api/auth/refresh", { refreshToken });
  return res.data as LoginResponse;
}

export async function logout(refreshToken: string) {
  await userApi.post("/api/auth/logout", { refreshToken });
}