import { useCallback, useState } from "react";

import { authApi } from "../../api/auth/auth.api";
import { createSignupRequest } from "../../api/auth/auth.mappers";

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const signup = useCallback(async (formValues) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const signupRequest =
        createSignupRequest(formValues);

      const signupData = await authApi.signup(
        signupRequest,
      );

      return signupData;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다.";

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
    signup,
    isLoading,
    errorMessage,
    clearError,
  };
}