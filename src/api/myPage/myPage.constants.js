export const MY_PAGE_ENDPOINTS = {
  summary: "/mypage",
  profile: "/users/me",
  bookmark: (jobNoticeId) =>
    `/job-notices/${jobNoticeId}/bookmark`,
  resume: (resumeId) =>
    `/resumes/${resumeId}`,
};
