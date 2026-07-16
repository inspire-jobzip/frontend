import {
  createResumeApi,
} from "./resume.api";

test("loads the authenticated resume list", async () => {
  const httpClient = {
    get: jest.fn().mockResolvedValue({
      status: 200,
      body: {
        success: true,
        data: [
          {
            resumeId: 10,
            title: "프론트엔드 이력서",
            name: "김데자",
            isDefault: true,
            updatedAt: "2026-07-14T10:00:00",
          },
        ],
      },
    }),
  };
  const api = createResumeApi(httpClient);

  const resumes = await api.getResumes({
    accessToken: "token",
  });

  expect(resumes[0].resumeId).toBe(10);
  expect(httpClient.get).toHaveBeenCalledWith(
    "/resumes",
    { accessToken: "token", signal: undefined },
  );
});

test("creates a resume and a nested project with authentication", async () => {
  const httpClient = {
    post: jest
      .fn()
      .mockResolvedValueOnce({
        status: 201,
        body: {
          success: true,
          data: {
            resumeId: 10,
            title: "Resume 01",
            isDefault: true,
          },
        },
      })
      .mockResolvedValueOnce({
        status: 201,
        body: {
          success: true,
          data: {
            resumeProjectId: 1,
            resumeId: 10,
            projectName: "Dejavu",
          },
        },
      }),
  };
  const api = createResumeApi(httpClient);

  const resume = await api.createResume({
    accessToken: "token",
    resume: { title: "Resume 01" },
  });
  await api.createProject({
    accessToken: "token",
    resumeId: resume.resumeId,
    project: { projectName: "Dejavu" },
  });

  expect(httpClient.post).toHaveBeenNthCalledWith(
    1,
    "/resumes",
    expect.objectContaining({
      accessToken: "token",
    }),
  );
  expect(httpClient.post).toHaveBeenNthCalledWith(
    2,
    "/resumes/10/projects",
    expect.objectContaining({
      accessToken: "token",
    }),
  );
});
