import {
  fireEvent,
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
  window.sessionStorage.clear();
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
});

test("restores the login session and exposes logout", async () => {
  window.sessionStorage.setItem(
    "dejavu.auth.session",
    JSON.stringify({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        userId: 1,
        email: "user@email.com",
        desiredJobRole: "BACKEND",
        careerStatus: "NEW",
      },
    }),
  );

  render(
    <MemoryRouter initialEntries={["/jobs"]}>
      <App />
    </MemoryRouter>,
  );

  const logoutButton = screen.getByRole("button", {
    name: "로그아웃",
  });
  expect(logoutButton).toBeInTheDocument();
  expect(
    screen.getByText("user@email.com"),
  ).toBeInTheDocument();

  const myPageLink = screen.getByRole("link", {
    name: "마이페이지",
  });
  expect(myPageLink).toHaveAttribute("href", "/mypage");

  fireEvent.click(myPageLink);
  expect(
    screen.getByRole("heading", {
      name: "마이페이지",
    }),
  ).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", {
      name: "로그아웃",
    }),
  );

  await waitFor(() => {
    expect(
      screen.getByRole("tab", { name: "로그인" }),
    ).toBeInTheDocument();
    expect(
      window.sessionStorage.getItem(
        "dejavu.auth.session",
      ),
    ).toBeNull();
  });
});
