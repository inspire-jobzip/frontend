export const JOB_DETAIL_ENDPOINTS = {
  detail: (jobNoticeId) =>
    `/job-notices/${jobNoticeId}`,
  analysis: (jobNoticeId) =>
    `/job-notices/${jobNoticeId}/ai-analysis`,
  recommendation: "/ai-recommendations",
};

export const JOB_DETAIL_LABELS = {
  jobCategory: {
    BACKEND: "백엔드",
    FRONTEND: "프론트엔드",
    FULLSTACK: "풀스택",
    MOBILE: "모바일",
    DATA: "데이터",
    AI: "AI",
    DEVOPS: "DevOps",
    SECURITY: "보안",
    QA: "QA",
    GAME: "게임",
  },
  experienceLevel: {
    ANY: "경력 무관",
    NEW: "신입",
    EXPERIENCED: "경력",
  },
};
