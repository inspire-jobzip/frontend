import { createAuthApi } from "./auth.api";

const responseData = {
  accessToken: "access-token",
  refreshToken: "refresh-token",
  user: {
    userId: 1,
    email: "user@email.com",
    desiredJobRole: "BACKEND",
    careerStatus: "NEW",
  },
};

test("login follows the documented request and response contract", async () => {
  const httpClient = {
    post: jest.fn().mockResolvedValue({
      status: 200,
      body: {
        success: true,
        data: responseData,
        message: null,
        error: null,
      },
    }),
  };

  await expect(
    createAuthApi(httpClient).login({
      email: " user@email.com ",
      password: "password1234",
    }),
  ).resolves.toEqual(responseData);
  expect(httpClient.post).toHaveBeenCalledWith(
    "/auth/login",
    {
      body: {
        email: "user@email.com",
        password: "password1234",
      },
    },
  );
});

test("signup sends all documented fields", async () => {
  const request = {
    email: "user@email.com",
    password: "password1234",
    desiredJobRole: "BACKEND",
    careerStatus: "NEW",
    careerYears: 0,
    preferredSkillNames: ["React"],
  };
  const data = { userId: 1, ...request };
  delete data.password;
  const httpClient = {
    post: jest.fn().mockResolvedValue({
      status: 200,
      body: { success: true, data },
    }),
  };

  await expect(
    createAuthApi(httpClient).signup(request),
  ).resolves.toEqual(data);
  expect(httpClient.post).toHaveBeenCalledWith(
    "/auth/signup",
    { body: request },
  );
});
