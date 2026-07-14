export const JOB_NOTICES_ENDPOINT =
  "/job-notices";

export const JOB_NOTICE_JOB_ROLES = [
  "BACKEND",
  "FRONTEND",
  "FULLSTACK",
  "MOBILE",
  "DATA",
  "AI",
  "DEVOPS",
  "SECURITY",
  "QA",
  "GAME",
];

export const JOB_NOTICE_JOB_ROLE_LABELS = {
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
};

export const JOB_NOTICE_EXPERIENCE_LEVELS = [
  "ANY",
  "NEW",
  "EXPERIENCED",
];

export const JOB_NOTICE_EXPERIENCE_LEVEL_LABELS = {
  ANY: "전체",
  NEW: "신입",
  EXPERIENCED: "경력",
};

export const JOB_NOTICE_SORT_OPTIONS = [
  "latest",
  "deadline",
];

export const JOB_NOTICE_SORT_LABELS = {
  latest: "최신순",
  deadline: "마감 임박순",
};

export const DEFAULT_JOB_NOTICE_FILTERS = {
  keyword: "",
  jobRole: "",
  skillNames: [],
  experienceLevel: "ANY",
  location: "",
  sort: "latest",
};

export const DEFAULT_JOB_NOTICE_PAGE = 0;
export const DEFAULT_JOB_NOTICE_PAGE_SIZE = 12;