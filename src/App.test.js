import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";

const EMPTY_JOB_NOTICE_RESPONSE = {
  success: true,
  data: {
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
  },
  error: null,
};

function createJsonResponse(body, status = 200) {
  return {
    status,
    text: jest.fn().mockResolvedValue(
      JSON.stringify(body),
    ),
  };
}

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue(
    createJsonResponse(
      EMPTY_JOB_NOTICE_RESPONSE,
    ),
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders the job notices page at the root route", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", {
      name: "채용공고 탐색",
    }),
  ).toBeInTheDocument();

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(
        /^\/api\/v1\/job-notices\?/,
      ),
      expect.objectContaining({
        method: "GET",
      }),
    );
  });
});

test("renders the authentication page at the auth route", () => {
  render(
    <MemoryRouter initialEntries={["/auth"]}>
      <App />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("tab", { name: "로그인" }),
  ).toHaveAttribute("aria-selected", "true");

  expect(global.fetch).not.toHaveBeenCalled();
});