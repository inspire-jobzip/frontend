import {
  parseApiDataResponse,
} from "../common/apiResponseParser";
import {
  createHttpClient,
} from "../common/httpClient";
import {
  CALENDAR_BOOKMARKS_ENDPOINT,
  CALENDAR_JOB_NOTICES_ENDPOINT,
} from "./calendar.constants";
import {
  createCalendarSearchParams,
} from "./calendar.mappers";
import {
  calendarResponseSchema,
} from "./calendar.schemas";

export function createCalendarApi(httpClient) {
  async function getJobNoticeCalendar({
    year,
    month,
    filters,
    signal,
  }) {
    const searchParams =
      createCalendarSearchParams({
        year,
        month,
        filters,
      });

    const response = await httpClient.get(
      `${CALENDAR_JOB_NOTICES_ENDPOINT}?${searchParams.toString()}`,
      { signal },
    );

    return parseApiDataResponse(
      response,
      calendarResponseSchema,
    );
  }

  async function getBookmarkCalendar({
    year,
    month,
    accessToken,
    signal,
  }) {
    const searchParams =
      createCalendarSearchParams({
        year,
        month,
        includeFilters: false,
      });

    const response = await httpClient.get(
      `${CALENDAR_BOOKMARKS_ENDPOINT}?${searchParams.toString()}`,
      { accessToken, signal },
    );

    return parseApiDataResponse(
      response,
      calendarResponseSchema,
    );
  }

  return {
    getJobNoticeCalendar,
    getBookmarkCalendar,
  };
}

const httpClient = createHttpClient();

export const calendarApi =
  createCalendarApi(httpClient);
