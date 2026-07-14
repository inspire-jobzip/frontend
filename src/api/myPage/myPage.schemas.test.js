import { myPageResponseSchema } from "./myPage.schemas";

test("message가 null인 마이페이지 성공 응답을 허용한다", () => {
  const response = {
    success: true,
    data: {
      profile: {
        userId: 1,
        email: "user@example.com",
        desiredJobRole: "BACKEND",
        careerStatus: "EXPERIENCED",
        careerYears: 3,
        preferredSkillNames: ["Java"],
      },
      bookmarks: [],
      resumes: [],
    },
    message: null,
    error: null,
  };

  expect(myPageResponseSchema.safeParse(response).success)
    .toBe(true);
});
