import queryString, { type StringifiableRecord } from "query-string";

import type { ApiErrorBody } from "../types/apiErrorBody";
import { NetworkError } from "./networkError";
import { ApiError } from "./apiError";
import type { RequestOptions } from "../types/requestOptions";
import { i18nProvider } from "../providers/i18nProvider";
import type { RefreshTokenResponse } from "../types/refreshTokenResponse";
import { authService } from "./authService";

const buildUrl = (path: string, query?: StringifiableRecord): string => {
  const baseUrl = `${import.meta.env.VITE_API_URL}${path}`;

  if (!query) return baseUrl;

  const serializedQuery = queryString.stringify(query, {
    arrayFormat: "none",
  });

  return `${baseUrl}?${serializedQuery}`;
};

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = authService.getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as RefreshTokenResponse;

    authService.updateAccessToken(data.accessToken);

    return data.accessToken;
  } catch {
    return null;
  }
};

export const httpService = {
  async request(
    path: string,
    { method, query, body }: RequestOptions = {},
  ): Promise<Response> {
    const url = buildUrl(path, query);
    const hasBody = body !== undefined;

    const doFetch = async (): Promise<Response> => {
      const token = authService.getToken();
      const hasToken = token !== null;

      try {
        return await fetch(url, {
          method,
          headers: new Headers({
            Accept: "application/json",
            ...(hasBody && { "Content-Type": "application/json" }),
            ...(hasToken && {
              Authorization: `Bearer ${token}`,
            }),
          }),
          body: hasBody ? JSON.stringify(body) : undefined,
        });
      } catch (error) {
        throw new NetworkError(
          i18nProvider.t("errors.network"),
          { cause: error },
        );
      }
    };

    let response = await doFetch();

    const shouldRefresh =
      response.status === 401 &&
      path !== "/auth/refresh" &&
      path !== "/auth/login";

    if (!shouldRefresh) {
      return response;
    }

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;

    if (newToken) {
      response = await doFetch();
    } else {
      authService.clearSession();
    }

    return response;
  },

  async parseBody<T = unknown>(response: Response): Promise<T> {
    const text = await response.text();
    const parsedBody = text ? JSON.parse(text) : undefined;

    if (!response.ok) {
      throw new ApiError(parsedBody as ApiErrorBody);
    }

    return parsedBody as T;
  },

  async fetchJson<T = unknown>(
    ...args: [path: string, options?: RequestOptions]
  ): Promise<T> {
    const response = await this.request(...args);

    return this.parseBody<T>(response);
  },
};