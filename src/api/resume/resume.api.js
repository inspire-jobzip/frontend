import {
  parseApiDataResponse,
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
} from "./resume.schemas";

export function createResumeApi(httpClient) {
  async function createResume({
    accessToken,
    resume,
    signal,
  }) {
    const response = await httpClient.post(
      RESUME_ENDPOINTS.collection,
      {
        accessToken,
        body: resume,
        signal,
      },
    );

    return parseApiDataResponse(
      response,
      createResumeResponseSchema,
    );
  }

  async function createProject({
    accessToken,
    resumeId,
    project,
    signal,
  }) {
    const response = await httpClient.post(
      RESUME_ENDPOINTS.projects(resumeId),
      {
        accessToken,
        body: project,
        signal,
      },
    );

    return parseApiDataResponse(
      response,
      createResumeProjectResponseSchema,
    );
  }

  return {
    createResume,
    createProject,
  };
}

const httpClient = createHttpClient();

export const resumeApi =
  createResumeApi(httpClient);
