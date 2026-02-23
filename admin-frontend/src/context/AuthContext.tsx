import React, { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, refresh as refreshApi, logout as logoutApi } from "../api/auth";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../auth/token";
import { decodeToken, isTokenExpired } from "../auth/jwt";

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function isAdminRole(role: string | null | undefined) {
  return role === "ADMIN";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setTokenState] = useState<string | null>(getAccessToken());
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const isAuthenticated = !!accessToken;

  useEffect(() => {
    let active = true;

    async function bootstrapAuth() {
      const currentAccessToken = getAccessToken();

      if (currentAccessToken && !isTokenExpired(currentAccessToken)) {
        try {
          const decoded = decodeToken(currentAccessToken);
          if (!isAdminRole(decoded.role)) {
            clearTokens();
            if (active) {
              setTokenState(null);
              setRole(null);
              setIsLoading(false);
            }
            return;
          }

          if (active) {
            setTokenState(currentAccessToken);
            setRole(decoded.role ?? null);
            setIsLoading(false);
          }
          return;
        } catch {
          clearTokens();
        }
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        if (active) {
          setTokenState(null);
          setRole(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await refreshApi(refreshToken);
        if (!active) return;

        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setTokenState(data.accessToken);

        const decoded = decodeToken(data.accessToken);
        if (!isAdminRole(decoded.role)) {
          clearTokens();
          setTokenState(null);
          setRole(null);
          return;
        }

        setRole(decoded.role ?? null);
      } catch {
        if (active) {
          clearTokens();
          setTokenState(null);
          setRole(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      active = false;
    };
  }, []);

  async function login(email: string, password: string) {
    const data = await loginApi(email, password);

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setTokenState(data.accessToken);

    const decoded = decodeToken(data.accessToken);
    if (!isAdminRole(decoded.role)) {
      clearTokens();
      setTokenState(null);
      setRole(null);
      throw new Error("Unauthorized role");
    }

    setRole(decoded.role ?? null);
  }

  async function logout() {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } finally {
      clearTokens();
      setTokenState(null);
      setRole(null);
    }
  }

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}