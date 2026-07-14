import { useState } from "react";

import { useLogin } from "../../hooks/auth/useLogin";

export function LoginForm({
  onLoginSuccess = () => {},
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    login,
    isLoading,
    errorMessage,
    clearError,
  } = useLogin();

  async function handleSubmit(event) {
    event.preventDefault();

    const loginData = await login({
      email,
      password,
    });

    if (loginData) {
      onLoginSuccess(loginData);
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
    clearError();
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    clearError();
  }

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
    >
      <div className="login-form__header">
        <h2>다시 만나서 반가워요</h2>
        <p>
          이메일과 비밀번호로 로그인해 주세요.
        </p>
      </div>

      <div className="login-form__field">
        <label htmlFor="login-email">
          이메일
        </label>

        <input
          id="login-email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="name@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="login-form__field">
        <label htmlFor="login-password">
          비밀번호
        </label>

        <input
          id="login-password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="비밀번호를 입력해 주세요"
          autoComplete="current-password"
          required
        />
      </div>

      <button
        className="login-form__forgot-password"
        type="button"
      >
        비밀번호를 잊으셨나요?
      </button>

      {errorMessage && (
        <p
          className="login-form__error"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <button
        className="login-form__submit"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}