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

  return {
    getJobNotices,
  };
}

const httpClient = createHttpClient();

export const jobNoticesApi =
  createJobNoticesApi(httpClient);