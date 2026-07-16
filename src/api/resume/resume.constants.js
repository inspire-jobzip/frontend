export const RESUME_ENDPOINTS = {
  collection: "/resumes",
  detail: (resumeId) => `/resumes/${resumeId}`,
  projects: (resumeId) =>
    `/resumes/${resumeId}/projects`,
};
