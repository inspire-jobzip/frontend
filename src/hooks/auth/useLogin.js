import { useCallback, useState } from "react";

import { authApi } from "../../api/auth/auth.api";
import { saveAuthSession } from "../../api/auth/auth.session";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const loginData = await authApi.login(
        credentials,
      );

      saveAuthSession(loginData);

      return loginData;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "로그인 중 오류가 발생했습니다.";

      setErrorMessage(message);

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage("");
  }, []);

  return {
    login,
    isLoading,
    errorMessage,
    clearError,
  };
}
