import { createJobDetailApi } from "./jobDetail.api";

function success(data) {
  return {
    status: 200,
    body: { success: true, data },
  };
}

test("uses the job detail and AI analysis endpoints", async () => {
  const detailData = {
    jobNoticeId: 101,
    externalNoticeId: null,
    companyName: "데자뷰랩",
    title: "프론트엔드 개발자",
    sourceUrl: null,
    jobCategory: "FRONTEND",
    locationText: "서울",
    experienceLevel: "NEW",
    employmentType: "정규직",
    educationLevel: null,
    salaryText: null,
    deadlineAt: null,
    roleKeywordsText: null,
    descriptionRaw: null,
    skillNames: ["React"],
    isBookmarked: false,
    jaccardScore: 0.8,
  };
  const analysisData = {
    jobNoticeId: 101,
    cached: false,
    aiAnalysis: {
      taskSummary: ["웹 서비스 개발"],
      requiredSkills: ["React"],
      possibleTasks: ["UI 구현"],
      analyzedAt: "2026-07-14T10:00:00",
    },
  };
  const httpClient = {
    get: jest.fn().mockResolvedValue(success(detailData)),
    post: jest.fn().mockResolvedValue(success(analysisData)),
  };
  const api = createJobDetailApi(httpClient);

  await api.getJobDetail({ jobNoticeId: 101 });
  await api.analyzeJob({ jobNoticeId: 101 });

  expect(httpClient.get).toHaveBeenCalledWith(
    "/job-notices/101",
    { signal: undefined },
  );
  expect(httpClient.post).toHaveBeenCalledWith(
    "/job-notices/101/ai-analysis",
    { signal: undefined },
  );
});

test("normalizes legacy AI analysis fields", async () => {
  const httpClient = {
    post: jest.fn().mockResolvedValue(success({
      jobNoticeId: 101,
      cached: true,
      aiAnalysis: { taskSummary: ["웹 서비스 개발"], requiredSkills: null },
    })),
  };

  await expect(
    createJobDetailApi(httpClient).analyzeJob({ jobNoticeId: 101 }),
  ).resolves.toMatchObject({
    aiAnalysis: { requiredSkills: [], possibleTasks: [], analyzedAt: "" },
  });
});

test("sends the explicitly selected resume only when requested", async () => {
  const recommendation = {
    aiRecommendationId: 1,
    userId: 2,
    jobNoticeId: 101,
    resumeId: 10,
    feedbackText: "좋은 출발입니다.",
    missingKeywords: ["TypeScript"],
    recommendedProjectTitle: "공고 탐색 서비스",
    recommendedProjectDescription: "React 기반 프로젝트",
    modelName: "test-model",
    createdAt: "2026-07-14T10:00:00",
  };
  const httpClient = {
    post: jest.fn().mockResolvedValue(success(recommendation)),
  };
  const api = createJobDetailApi(httpClient);

  await api.createRecommendation({
    accessToken: "access-token",
    jobNoticeId: 101,
    resumeId: 10,
  });

  expect(httpClient.post).toHaveBeenCalledWith(
    "/ai-recommendations",
    {
      accessToken: "access-token",
      body: { jobNoticeId: 101, resumeId: 10 },
      signal: undefined,
    },
  );
});
