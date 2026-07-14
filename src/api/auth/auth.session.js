const AUTH_SESSION_KEY = "dejavu.auth.session";

function getStorage() {
  return typeof window === "undefined"
    ? null
    : window.sessionStorage;
}

export function saveAuthSession(loginData) {
  const session = {
    accessToken: loginData.accessToken,
    refreshToken: loginData.refreshToken,
    user: loginData.user,
  };

  getStorage()?.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify(session),
  );

  return session;
}

export function getAuthSession() {
  const storedSession = getStorage()?.getItem(
    AUTH_SESSION_KEY,
  );

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession);
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  getStorage()?.removeItem(AUTH_SESSION_KEY);
}
