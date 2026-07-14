import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { JobNoticeDetailPage } from "./JobNoticeDetailPage";

const detail = {
  jobNoticeId: 101,
  externalNoticeId: "external-101",
  companyName: "데자뷰랩",
  title: "프론트엔드 개발자",
  sourceUrl: "https://example.com/jobs/101",
  jobCategory: "FRONTEND",
  locationText: "서울 강남구",
  experienceLevel: "NEW",
  employmentType: "정규직",
  educationLevel: "학력 무관",
  salaryText: "회사 내규",
  deadlineAt: "2026-08-31T23:59:59",
  roleKeywordsText: "웹 서비스, 사용자 경험",
  descriptionRaw: "React 기반 웹 서비스를 개발합니다.",
  skillNames: ["React", "JavaScript"],
  isBookmarked: false,
  jaccardScore: 0.72,
};

const analysis = {
  jobNoticeId: 101,
  cached: false,
  aiAnalysis: {
    taskSummary: ["웹 서비스 개발"],
    requiredSkills: ["React"],
    possibleTasks: ["공통 컴포넌트 구현"],
    analyzedAt: "2026-07-14T10:00:00",
  },
};

const resumes = [
  {
    resumeId: 10,
    title: "기본 프론트엔드 이력서",
    name: "김데자",
    isDefault: true,
    updatedAt: "2026-07-14T09:00:00",
  },
  {
    resumeId: 11,
    title: "프로젝트 중심 이력서",
    name: "김데자",
    isDefault: false,
    updatedAt: "2026-07-13T09:00:00",
  },
];

const recommendation = {
  aiRecommendationId: 1,
  userId: 7,
  jobNoticeId: 101,
  resumeId: 10,
  feedbackText: "React 경험이 공고와 잘 맞습니다.",
  missingKeywords: ["TypeScript", "테스트 자동화"],
  recommendedProjectTitle: "채용공고 큐레이션 서비스",
  recommendedProjectDescription: "검색과 필터를 갖춘 서비스입니다.",
  modelName: "test-model",
  createdAt: "2026-07-14T10:05:00",
};

function response(data) {
  return Promise.resolve({
    status: 200,
    text: () =>
      Promise.resolve(
        JSON.stringify({ success: true, data }),
      ),
  });
}

beforeEach(() => {
  global.fetch = jest.fn((url, options = {}) => {
    if (url === "/api/v1/job-notices/101") {
      return response(detail);
    }
    if (url === "/api/v1/job-notices/101/ai-analysis") {
      return response(analysis);
    }
    if (url === "/api/v1/resumes") {
      return response(resumes);
    }
    if (
      url === "/api/v1/ai-recommendations" &&
      options.method === "POST"
    ) {
      return response(recommendation);
    }
    throw new Error(`Unexpected request: ${url}`);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("runs resume feedback only after the user clicks the comparison button", async () => {
  render(
    <MemoryRouter initialEntries={["/jobs/101"]}>
      <Routes>
        <Route
          path="/jobs/:jobNoticeId"
          element={
            <JobNoticeDetailPage
              authSession={{
                accessToken: "access-token",
                user: {
                  name: "김데자",
                  email: "dejavu@example.com",
                },
              }}
            />
          }
        />
      </Routes>
    </MemoryRouter>,
  );

  const button = await screen.findByRole("button", {
    name: "이력서와 비교·분석하기",
  });
  expect(
    screen.getByLabelText("비교할 이력서 선택"),
  ).toHaveValue("10");
  expect(
    global.fetch.mock.calls.some(
      ([url]) => url === "/api/v1/ai-recommendations",
    ),
  ).toBe(false);

  fireEvent.click(button);

  expect(
    await screen.findByRole("heading", {
      name: "공고 맞춤 분석 결과",
    }),
  ).toBeInTheDocument();
  expect(screen.getByText("TypeScript")).toBeInTheDocument();

  await waitFor(() => {
    const [, request] = global.fetch.mock.calls.find(
      ([url]) => url === "/api/v1/ai-recommendations",
    );
    expect(request.headers.get("Authorization")).toBe(
      "Bearer access-token",
    );
    expect(JSON.parse(request.body)).toEqual({
      jobNoticeId: 101,
      resumeId: 10,
    });
  });
});
