import { jwtDecode } from "jwt-decode";

export type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  exp: number;
};

export function decodeToken(token: string): JwtPayload {
  return jwtDecode<JwtPayload>(token);
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeToken(token);
    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}