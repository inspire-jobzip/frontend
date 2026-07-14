import {
  parseApiDataResponse,
} from "../common/apiResponseParser";
import {
  createHttpClient,
} from "../common/httpClient";
import {
  JOB_NOTICES_ENDPOINT,
} from "./jobNotices.constants";
import {
  createJobNoticesSearchParams,
} from "./jobNotices.mappers";
import {
  jobNoticeListResponseSchema,
  bookmarkResponseSchema,
} from "./jobNotices.schemas";

export function createJobNoticesApi(httpClient) {
  async function getJobNotices({
    filters,
    page,
    size,
    signal,
  } = {}) {
    const searchParams =
      createJobNoticesSearchParams({
        filters,
        page,
        size,
      });

    const response = await httpClient.get(
      `${JOB_NOTICES_ENDPOINT}?${searchParams.toString()}`,
      {
        signal,
      },
    );

    return parseApiDataResponse(
      response,
      jobNoticeListResponseSchema,
    );
  }

  async function createBookmark({
    jobNoticeId,
    accessToken,
  }) {
    const response = await httpClient.post(
      `${JOB_NOTICES_ENDPOINT}/${jobNoticeId}/bookmark`,
      { accessToken },
    );

    return parseApiDataResponse(
      response,
      bookmarkResponseSchema,
    );
  }

  async function deleteBookmark({
    jobNoticeId,
    accessToken,
  }) {
    const response = await httpClient.delete(
      `${JOB_NOTICES_ENDPOINT}/${jobNoticeId}/bookmark`,
      { accessToken },
    );

    return parseApiDataResponse(
      response,
      bookmarkResponseSchema,
    );
  }

  return {
    getJobNotices,
    createBookmark,
    deleteBookmark,
  };
}

const httpClient = createHttpClient();

export const jobNoticesApi =
  createJobNoticesApi(httpClient);
