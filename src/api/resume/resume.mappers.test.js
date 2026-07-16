import {
  createProjectRequests,
  createResumeRequest,
} from "./resume.mappers";

test("maps the form to the resume and project API payloads", () => {
  const form = {
    title: " Backend Resume ",
    name: " 김나연 ",
    email: "user@email.com",
    phone: "",
    githubUrl: "https://github.com/user",
    blogUrl: "",
    summaryText: " 소개 ",
    education: [
      {
        schoolName: " Korea University ",
        major: "Computer Science",
        status: "Graduated",
        startYearMonth: "2020-03",
        endYearMonth: "2024-02",
      },
    ],
    experience: [
      {
        companyName: "회사",
        roleName: "개발자",
        employmentType: "INTERN",
        startYearMonth: "2026-01",
        endYearMonth: "2026-06",
        isCurrent: true,
        responsibilities: "업무",
      },
    ],
    selectedSkills: [
      { skillId: 1, skillName: "Java" },
    ],
    motivationText: "",
    strengthsAndWeaknessesText: "",
    isDefault: true,
    projects: [
      {
        projectName: "Dejavu",
        roleName: "Backend",
        startYearMonth: "2026-04",
        endYearMonth: "2026-06",
        description: "설명",
        troubleshooting: "해결",
        techStacksInput: "Java, Spring Boot",
      },
    ],
  };

  expect(createResumeRequest(form)).toEqual(
    expect.objectContaining({
      title: "Backend Resume",
      name: "김나연",
      phone: null,
      blogUrl: null,
      resumeSkillNames: ["Java"],
      education: [
        "Korea University | Computer Science | Graduated | 2020-03 ~ 2024-02",
      ],
      experience: [
        expect.objectContaining({
          endYearMonth: null,
          sortOrder: 1,
        }),
      ],
    }),
  );

  expect(
    createProjectRequests(form.projects),
  ).toEqual([
    expect.objectContaining({
      techStacks: ["Java", "Spring Boot"],
      sortOrder: 1,
    }),
  ]);
});
