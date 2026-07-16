import {
  parseApiDataResponse,
  parseApiMessageResponse,
} from "../common/apiResponseParser";
import {
  createHttpClient,
} from "../common/httpClient";
import {
  RESUME_ENDPOINTS,
} from "./resume.constants";
import {
  createResumeProjectResponseSchema,
  createResumeResponseSchema,
  resumeDetailResponseSchema,
  resumeListResponseSchema,
  resumeMutationResponseSchema,
} from "./resume.schemas";

export function createResumeApi(httpClient) {
  async function getResumes({ accessToken, signal }) {
    const response = await httpClient.get(
      RESUME_ENDPOINTS.collection,
      { accessToken, signal },
    );
    return parseApiDataResponse(
      response,
      resumeListResponseSchema,
    );
  }

  async function getResume({ accessToken, resumeId, signal }) {
    const response = await httpClient.get(
      RESUME_ENDPOINTS.detail(resumeId),
      { accessToken, signal },
    );
    return parseApiDataResponse(response, resumeDetailResponseSchema);
  }

  async function createResume({ accessToken, resume, signal }) {
    const response = await httpClient.post(
      RESUME_ENDPOINTS.collection,
      { accessToken, body: resume, signal },
    );
    return parseApiDataResponse(response, createResumeResponseSchema);
  }

  async function updateResume({ accessToken, resumeId, resume, signal }) {
    const response = await httpClient.patch(
      RESUME_ENDPOINTS.detail(resumeId),
      { accessToken, body: resume, signal },
    );
    return parseApiDataResponse(response, resumeDetailResponseSchema);
  }

  async function createProject({ accessToken, resumeId, project, signal }) {
    const response = await httpClient.post(
      RESUME_ENDPOINTS.projects(resumeId),
      { accessToken, body: project, signal },
    );
    return parseApiDataResponse(response, createResumeProjectResponseSchema);
  }

  async function updateProject({ accessToken, resumeId, projectId, project, signal }) {
    const response = await httpClient.patch(
      `${RESUME_ENDPOINTS.projects(resumeId)}/${projectId}`,
      { accessToken, body: project, signal },
    );
    return parseApiDataResponse(response, createResumeProjectResponseSchema);
  }

  async function deleteResume({ accessToken, resumeId, signal }) {
    const response = await httpClient.delete(
      RESUME_ENDPOINTS.detail(resumeId),
      { accessToken, signal },
    );
    return parseApiMessageResponse(response, resumeMutationResponseSchema);
  }
  async function deleteProject({ accessToken, resumeId, projectId, signal }) {
    const response = await httpClient.delete(
      `${RESUME_ENDPOINTS.projects(resumeId)}/${projectId}`,
      { accessToken, signal },
    );
    return parseApiMessageResponse(response, resumeMutationResponseSchema);
  }

  return {
    getResumes,
    getResume,
    createResume,
    updateResume,
    deleteResume,
    createProject,
    updateProject,
    deleteProject,
  };
}

const httpClient = createHttpClient();

export const resumeApi = createResumeApi(httpClient);
