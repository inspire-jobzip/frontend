import {
  parseApiDataResponse,
} from "../common/apiResponseParser";
import {
  createHttpClient,
} from "../common/httpClient";
import {
  JOB_DETAIL_ENDPOINTS,
} from "./jobDetail.constants";
import {
  aiRecommendationResponseSchema,
  jobAnalysisResponseSchema,
  jobDetailResponseSchema,
} from "./jobDetail.schemas";

export function createJobDetailApi(httpClient) {
  async function getJobDetail({
    accessToken,
    jobNoticeId,
    signal,
  }) {
    const response = await httpClient.get(
      JOB_DETAIL_ENDPOINTS.detail(jobNoticeId),
      { accessToken, signal },
    );

    return parseApiDataResponse(
      response,
      jobDetailResponseSchema,
    );
  }

  async function analyzeJob({
    jobNoticeId,
    signal,
  }) {
    const response = await httpClient.post(
      JOB_DETAIL_ENDPOINTS.analysis(jobNoticeId),
      { signal },
    );

    return parseApiDataResponse(
      response,
      jobAnalysisResponseSchema,
    );
  }

  async function createRecommendation({
    accessToken,
    jobNoticeId,
    resumeId,
    signal,
  }) {
    const response = await httpClient.post(
      JOB_DETAIL_ENDPOINTS.recommendation,
      {
        accessToken,
        body: { jobNoticeId, resumeId },
        signal,
      },
    );

    return parseApiDataResponse(
      response,
      aiRecommendationResponseSchema,
    );
  }

  return {
    getJobDetail,
    analyzeJob,
    createRecommendation,
  };
}

const httpClient = createHttpClient();

export const jobDetailApi =
  createJobDetailApi(httpClient);
