import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import {
  MemoryRouter,
} from "react-router-dom";

import { CalendarPage } from "./CalendarPage";

function createJsonResponse(body, status = 200) {
  return Promise.resolve({
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  });
}

const publicCalendarResponse = {
  success: true,
  data: {
    year: 2026,
    month: 7,
    events: [
      {
        jobNoticeId: 101,
        companyName: "카카오",
        title: "Backend Developer",
        deadlineAt: "2026-07-15T23:59:59",
        eventType: "DEADLINE",
        recruitStatus: "OPEN",
        recruitStatusText: "모집 중",
      },
    ],
  },
};

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(
    new Date(2026, 6, 15, 9, 0, 0),
  );
  global.fetch = jest.fn((url) => {
    if (
      url.startsWith(
        "/api/v1/calendar/job-notices?",
      )
    ) {
      return createJsonResponse(
        publicCalendarResponse,
      );
    }

    throw new Error(`Unexpected request: ${url}`);
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test("renders public deadlines and applies a job role filter", async () => {
  render(
    <MemoryRouter>
      <CalendarPage />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", {
      name: "채용 일정 캘린더",
    }),
  ).toBeInTheDocument();
  expect(
    await screen.findByText("카카오 · Backend Developer"),
  ).toBeInTheDocument();
  expect(screen.getByText(/모집 중 · D-Day/)).toBeInTheDocument();

  fireEvent.change(
    screen.getByLabelText("직무 필터"),
    { target: { value: "BACKEND" } },
  );

  await waitFor(() => {
    expect(
      global.fetch.mock.calls.some(([url]) =>
        url.includes("jobRole=BACKEND"),
      ),
    ).toBe(true);
  });

  await waitFor(() => {
    expect(
      screen.getByLabelText("직무 필터"),
    ).not.toBeDisabled();
  });
});

test("asks signed-out users to log in before showing saved schedules", async () => {
  render(
    <MemoryRouter>
      <CalendarPage />
    </MemoryRouter>,
  );

  await screen.findByText(
    "카카오 · Backend Developer",
  );

  fireEvent.click(
    screen.getByRole("tab", {
      name: "내 스크랩",
    }),
  );

  expect(
    screen.getByText(
      "스크랩 일정은 로그인 후 볼 수 있어요.",
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "로그인하기" }),
  ).toHaveAttribute("href", "/auth");
  expect(
    global.fetch.mock.calls.some(([url]) =>
      url.includes("/calendar/bookmarks"),
    ),
  ).toBe(false);
});
