import { getAccessToken, getRefreshToken } from "../auth/token";

export const STORE_FRONTEND_URL =
  import.meta.env.VITE_STORE_FRONTEND_URL ??
  "https://store-frontend-git-store-frontend.2.rahtiapp.fi";

export function buildAuthenticatedStoreUrl(path: string = "/", returnTo?: string): string {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  const url = new URL(path, STORE_FRONTEND_URL);

  if (accessToken) {
    url.searchParams.set("accessToken", accessToken);
  }

  if (refreshToken) {
    url.searchParams.set("refreshToken", refreshToken);
  }

  if (returnTo) {
    url.searchParams.set("returnTo", returnTo);
  }

  return url.toString();
}