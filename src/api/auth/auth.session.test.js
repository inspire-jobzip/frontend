import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from "./auth.session";

const loginData = {
  accessToken: "access-token",
  refreshToken: "refresh-token",
  user: {
    userId: 1,
    email: "user@email.com",
    desiredJobRole: "BACKEND",
    careerStatus: "NEW",
  },
};

afterEach(clearAuthSession);

test("stores and restores the authenticated session", () => {
  saveAuthSession(loginData);
  expect(getAuthSession()).toEqual(loginData);
});

test("clears an invalid stored session", () => {
  window.sessionStorage.setItem(
    "dejavu.auth.session",
    "invalid-json",
  );
  expect(getAuthSession()).toBeNull();
});
