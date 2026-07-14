import { useState } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthPage } from "./pages/AuthPage";
import { JobNoticesPage } from "./pages/JobNoticesPage";
import { MyPage } from "./pages/MyPage";
import { authApi } from "./api/auth/auth.api";
import {
  clearAuthSession,
  getAuthSession,
} from "./api/auth/auth.session";

function App() {
  const [authSession, setAuthSession] = useState(
    getAuthSession,
  );

  function handleLoginSuccess(loginData) {
    setAuthSession(loginData);
  }

  async function handleLogout() {
    try {
      if (authSession) {
        await authApi.logout(authSession);
      }
    } catch {
      // 서버 세션 정리에 실패해도 사용자가 요청한 로컬 로그아웃은 완료한다.
    } finally {
      clearAuthSession();
      setAuthSession(null);
    }
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <JobNoticesPage
            authSession={authSession}
            onLogout={handleLogout}
          />
        }
      />

      <Route
        path="/jobs"
        element={
          <JobNoticesPage
            authSession={authSession}
            onLogout={handleLogout}
          />
        }
      />

      <Route
        path="/auth"
        element={
          authSession ? (
            <Navigate to="/jobs" replace />
          ) : (
            <AuthPage
              onLoginSuccess={handleLoginSuccess}
            />
          )
        }
      />

      <Route
        path="/mypage"
        element={
          authSession ? (
            <MyPage
              authSession={authSession}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
