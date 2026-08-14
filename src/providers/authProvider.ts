import { StatusCodes } from "http-status-codes";
import type {
  AuthProvider,
  AuthActionResponse,
  CheckResponse,
  OnErrorResponse,
} from "@refinedev/core";

import { i18nProvider } from "./i18nProvider";
import { httpService } from "../services/httpService";
import { authService } from "../services/authService";
import type { AuthResponse } from "../types/authResponse";
import { ApiError } from "../services/apiError";

type LoginParams = {
  email: string;
  password: string;
};

export const authProvider: AuthProvider = {
  async login(params: LoginParams): Promise<AuthActionResponse> {
    try {
      const auth = await httpService.fetchJson<AuthResponse>("/auth/login", {
        method: "POST",
        body: params,
      });

      authService.storeSession(auth.accessToken, auth.refreshToken);

      if (!authService.getRole()) {
        authService.clearSession();

        return {
          success: false,
          error: new Error(
            i18nProvider.t("auth.unauthorizedRole"),
          ),
        };
      }

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.detail
          : i18nProvider.t("errors.network");

      return {
        success: false,
        error: new Error(message),
      };
    }
  },

  async logout(): Promise<AuthActionResponse> {
    const refreshToken = authService.getRefreshToken();

    try {
      if (refreshToken) {
        await httpService.fetchJson("/auth/logout", {
          method: "POST",
          body: {
            refreshToken,
          },
        });
      }
    } catch {
      // Mesmo que o backend falhe, a sessão local deve ser encerrada.
    } finally {
      authService.clearSession();
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  async check(): Promise<CheckResponse> {
  if (authService.isTokenValid() && authService.getRole()) {
    return {
      authenticated: true,
    };
  }

  if (authService.getRefreshToken()) {
    try {
      const response = await httpService.request("/categories", { query: { perPage: 1, page: 1 } });

      if (response.ok && authService.getRole()) {
        return {
          authenticated: true,
        };
      }
    } catch {
      // Falha na validação/refresh.
    }
  }

  authService.clearSession();

  return {
    authenticated: false,
    logout: true,
    redirectTo: "/login",
  };
},

  async onError(error: ApiError): Promise<OnErrorResponse> {
    const isAuthError =
      error?.status === StatusCodes.UNAUTHORIZED ||
      error?.status === StatusCodes.FORBIDDEN;

    if (!isAuthError) {
      return {
        logout: false,
      };
    }

    authService.clearSession();

    return {
      logout: true,
      redirectTo: "/login",
    };
  },

  async getIdentity() {
    const claims = authService.getClaims();

    if (!claims) {
      throw new Error(
        i18nProvider.t("auth.notAuthenticated"),
      );
    }

    return {
      id: claims.sub,
      role: claims.role,
    };
  },

  async getPermissions() {
    return authService.getRole();
  },
};