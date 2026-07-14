import {
  createResumeApi,
} from "./resume.api";

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
