const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_KEY);
}

export function setAccessToken(token: string) {
  sessionStorage.setItem(ACCESS_KEY, token);
}

export function clearAccessToken() {
  sessionStorage.removeItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_KEY);
}

export function setRefreshToken(token: string) {
  sessionStorage.setItem(REFRESH_KEY, token);
}

export function clearRefreshToken() {
  sessionStorage.removeItem(REFRESH_KEY);
}

export function clearTokens() {
  clearAccessToken();
  clearRefreshToken();
}