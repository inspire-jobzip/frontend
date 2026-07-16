import {
  createCalendarApi,
} from "./calendar.api";

const calendarBody = {
  success: true,
  data: {
    year: 2026,
    month: 7,
    events: [],
  },
};

test("requests the public calendar with role and skill filters", async () => {
  const httpClient = {
    get: jest.fn().mockResolvedValue({
      status: 200,
      body: calendarBody,
    }),
  };
  const api = createCalendarApi(httpClient);

  await api.getJobNoticeCalendar({
    year: 2026,
    month: 7,
    filters: {
      jobRole: "BACKEND",
      skillNames: ["Java", "Spring Boot"],
    },
  });

  expect(httpClient.get).toHaveBeenCalledWith(
    "/calendar/job-notices?year=2026&month=7&jobRole=BACKEND&skillNames=Java%2CSpring+Boot",
    { signal: undefined },
  );
});

test("requests the bookmark calendar with authentication only", async () => {
  const httpClient = {
    get: jest.fn().mockResolvedValue({
      status: 200,
      body: {
        ...calendarBody,
        data: {
          ...calendarBody.data,
          summary: {
            openCount: 0,
            closingSoonCount: 0,
            closedCount: 0,
          },
        },
      },
    }),
  };
  const api = createCalendarApi(httpClient);

  await api.getBookmarkCalendar({
    year: 2026,
    month: 7,
    accessToken: "access-token",
  });

  expect(httpClient.get).toHaveBeenCalledWith(
    "/calendar/bookmarks?year=2026&month=7",
    {
      accessToken: "access-token",
      signal: undefined,
    },
  );
});
