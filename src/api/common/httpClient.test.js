import { createHttpClient } from "./httpClient";

describe("httpClient", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("PATCH 요청에 인증 헤더와 JSON 본문을 전달한다", async () => {
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue({
        status: 200,
        text: async () =>
          JSON.stringify({ success: true }),
      });
    const client = createHttpClient("/api/v1");

    await client.patch("/users/me", {
      accessToken: "access-token",
      body: { careerYears: 3 },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/users/me",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ careerYears: 3 }),
      }),
    );

    const { headers } = fetchMock.mock.calls[0][1];
    expect(headers.get("Authorization")).toBe(
      "Bearer access-token",
    );
    expect(headers.get("Content-Type")).toBe(
      "application/json",
    );
  });

  test("DELETE 요청에 인증 헤더를 전달한다", async () => {
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue({
        status: 200,
        text: async () =>
          JSON.stringify({ success: true }),
      });
    const client = createHttpClient("/api/v1");

    await client.delete(
      "/job-notices/10/bookmark",
      { accessToken: "access-token" },
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/job-notices/10/bookmark",
      expect.objectContaining({
        method: "DELETE",
        body: undefined,
      }),
    );

    const { headers } = fetchMock.mock.calls[0][1];
    expect(headers.get("Authorization")).toBe(
      "Bearer access-token",
    );
  });
});
