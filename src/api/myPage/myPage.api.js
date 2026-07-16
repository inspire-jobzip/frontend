import {
  parseApiDataResponse,
  parseApiMessageResponse,
} from "../common/apiResponseParser";
import {
  createHttpClient,
} from "../common/httpClient";
import {
  MY_PAGE_ENDPOINTS,
} from "./myPage.constants";
import {
  bookmarkDeleteResponseSchema,
  myPageResponseSchema,
  resumeDeleteResponseSchema,
  updateProfileResponseSchema,
} from "./myPage.schemas";

export function createMyPageApi(httpClient) {
  async function getMyPage({
    accessToken,
    signal,
  }) {
    const response = await httpClient.get(
      MY_PAGE_ENDPOINTS.summary,
      {
        accessToken,
        signal,
      },
    );

    return parseApiDataResponse(
      response,
      myPageResponseSchema,
    );
  }

  async function updateProfile({
    accessToken,
    profile,
    signal,
  }) {
    const response = await httpClient.patch(
      MY_PAGE_ENDPOINTS.profile,
      {
        accessToken,
        body: profile,
        signal,
      },
    );

    return parseApiDataResponse(
      response,
      updateProfileResponseSchema,
    );
  }

  async function deleteBookmark({
    accessToken,
    jobNoticeId,
    signal,
  }) {
    const response = await httpClient.delete(
      MY_PAGE_ENDPOINTS.bookmark(
        jobNoticeId,
      ),
      {
        accessToken,
        signal,
      },
    );

    return parseApiDataResponse(
      response,
      bookmarkDeleteResponseSchema,
    );
  }

  async function deleteResume({
    accessToken,
    resumeId,
    signal,
  }) {
    const response = await httpClient.delete(
      MY_PAGE_ENDPOINTS.resume(resumeId),
      {
        accessToken,
        signal,
      },
    );

    if (response.status === 204) {
      return {
        message: "이력서가 삭제되었습니다.",
      };
    }

    return parseApiMessageResponse(
      response,
      resumeDeleteResponseSchema,
    );
  }

  return {
    getMyPage,
    updateProfile,
    deleteBookmark,
    deleteResume,
  };
}

const httpClient = createHttpClient();

export const myPageApi =
  createMyPageApi(httpClient);
