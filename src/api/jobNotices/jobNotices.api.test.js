import { createJobNoticesApi } from "./jobNotices.api";

function createSuccessResponse(isBookmarked) {
  return {
    status: 200,
    body: {
      success: true,
      data: {
        ...(isBookmarked ? { bookmarkId: 20 } : {}),
        jobNoticeId: 10,
        isBookmarked,
      },
      message: null,
      error: null,
    },
  };
}

test("북마크 생성 API를 인증 토큰과 함께 호출한다", async () => {
  const httpClient = {
    post: jest
      .fn()
      .mockResolvedValue(createSuccessResponse(true)),
  };
  const api = createJobNoticesApi(httpClient);

  const result = await api.createBookmark({
    jobNoticeId: 10,
    accessToken: "access-token",
  });

  expect(httpClient.post).toHaveBeenCalledWith(
    "/job-notices/10/bookmark",
    { accessToken: "access-token" },
  );
  expect(result.isBookmarked).toBe(true);
});

test("북마크 해제 API를 인증 토큰과 함께 호출한다", async () => {
  const httpClient = {
    delete: jest
      .fn()
      .mockResolvedValue(createSuccessResponse(false)),
  };
  const api = createJobNoticesApi(httpClient);

  const result = await api.deleteBookmark({
    jobNoticeId: 10,
    accessToken: "access-token",
  });

  expect(httpClient.delete).toHaveBeenCalledWith(
    "/job-notices/10/bookmark",
    { accessToken: "access-token" },
  );
  expect(result.isBookmarked).toBe(false);
});
