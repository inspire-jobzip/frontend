import { createHttpClient } from "../common/httpClient";
import {
  parseApiDataResponse,
  parseApiMessageResponse,
} from "../common/apiResponseParser";
import { AUTH_ENDPOINTS } from "./auth.constants";
import {
  loginResponseSchema,
  logoutResponseSchema,
  refreshTokenResponseSchema,
  signupResponseSchema,
} from "./auth.schemas";

export function createAuthApi(httpClient) {
  async function signup(request) {
    const response = await httpClient.post(
      AUTH_ENDPOINTS.signup,
      {
        body: request,
      },
    );

    return parseApiDataResponse(
      response,
      signupResponseSchema,
    );
  }

  async function login(request) {
    const response = await httpClient.post(
      AUTH_ENDPOINTS.login,
      {
        body: {
          email: request.email.trim(),
          password: request.password,
        },
      },
    );

    return parseApiDataResponse(
      response,
      loginResponseSchema,
    );
  }

  async function refresh(request) {
    const response = await httpClient.post(
      AUTH_ENDPOINTS.refresh,
      {
        body: {
          refreshToken: request.refreshToken,
        },
      },
    );

    return parseApiDataResponse(
      response,
      refreshTokenResponseSchema,
    );
  }

  async function logout({
    accessToken,
    refreshToken,
  }) {
    const response = await httpClient.post(
      AUTH_ENDPOINTS.logout,
      {
        accessToken,
        body: {
          refreshToken,
        },
      },
    );

    return parseApiMessageResponse(
      response,
      logoutResponseSchema,
    );
  }

  return {
    signup,
    login,
    refresh,
    logout,
  };
}

const httpClient = createHttpClient();

export const authApi = createAuthApi(httpClient);