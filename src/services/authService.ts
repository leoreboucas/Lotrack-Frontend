import { jwtDecode } from "jwt-decode";

import type { JwtClaims } from "../types/jwtClaims";
import { UserRole } from "../types/userRole";

const TOKEN_KEY = "Lotrack.token";
const REFRESH_TOKEN_KEY = "Lotrack.refreshToken";

const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const getClaims = (): JwtClaims | null => {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    return jwtDecode<JwtClaims>(token);
  } catch {
    return null;
  }
};

const getRole = (): UserRole | null => {
  const claims = getClaims();

  if (!claims) {
    return null;
  }

  return Object.values(UserRole).includes(claims.role)
    ? claims.role
    : null;
};

const isTokenValid = (): boolean => {
  const claims = getClaims();

  if (!claims) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const skew = 30;

  return claims.exp > now + skew;
};

const hasSession = (): boolean => {
  return getToken() !== null;
};

const storeSession = (
  accessToken: string,
  refreshToken: string,
): void => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const updateAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const authService = {
  getToken,
  getRefreshToken,
  getClaims,
  getRole,
  isTokenValid,
  hasSession,
  storeSession,
  updateAccessToken,
  clearSession,
};