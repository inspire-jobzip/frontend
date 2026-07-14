let nextClientId = 0;

function createClientId(prefix) {
  nextClientId += 1;
  return `${prefix}-${nextClientId}`;
}

function nullableText(value) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
}

function nullableYearMonth(value) {
  return value || null;
}

function createEducationSummary(education) {
  const period = [
    education.startYearMonth,
    education.endYearMonth,
  ]
    .filter(Boolean)
    .join(" ~ ");

  return [
    education.schoolName.trim(),
    education.major.trim(),
    education.status,
    period,
  ]
    .filter(Boolean)
    .join(" | ");
}

export function createEmptyEducation() {
  return {
    clientId: createClientId("education"),
    schoolName: "",
    major: "",
    status: "재학",
    startYearMonth: "",
    endYearMonth: "",
  };
}

export function createEmptyExperience() {
  return {
    clientId: createClientId("experience"),
    companyName: "",
    roleName: "",
    employmentType: "FULL_TIME",
    startYearMonth: "",
    endYearMonth: "",
    isCurrent: false,
    responsibilities: "",
  };
}

export function createEmptyProject() {
  return {
    clientId: createClientId("project"),
    projectName: "",
    roleName: "",
    startYearMonth: "",
    endYearMonth: "",
    description: "",
    troubleshooting: "",
    techStacksInput: "",
  };
}

export function createResumeRequest(form) {
  return {
    title: form.title.trim(),
    name: form.name.trim(),
    email: form.email.trim(),
    phone: nullableText(form.phone),
    githubUrl: nullableText(form.githubUrl),
    blogUrl: nullableText(form.blogUrl),
    summaryText: nullableText(form.summaryText),
    education: form.education
      .filter(
        (education) =>
          education.schoolName.trim() ||
          education.major.trim() ||
          education.startYearMonth ||
          education.endYearMonth,
      )
      // The current backend DTO accepts education as List<String>.
      // Keep all structured form values in a readable string.
      .map(createEducationSummary),
    experience: form.experience
      .filter(
        (experience) =>
          experience.companyName.trim() ||
          experience.roleName.trim() ||
          experience.startYearMonth ||
          experience.endYearMonth ||
          experience.responsibilities.trim(),
      )
      .map((experience, index) => ({
        companyName:
          experience.companyName.trim(),
        roleName: experience.roleName.trim(),
        employmentType:
          experience.employmentType,
        startYearMonth:
          experience.startYearMonth,
        endYearMonth: experience.isCurrent
          ? null
          : nullableYearMonth(
              experience.endYearMonth,
            ),
        isCurrent: experience.isCurrent,
        responsibilities: nullableText(
          experience.responsibilities,
        ),
        sortOrder: index + 1,
      })),
    resumeSkillNames: form.selectedSkills.map(
      (skill) => skill.skillName,
    ),
    motivationText: nullableText(
      form.motivationText,
    ),
    strengthsAndWeaknessesText: nullableText(
      form.strengthsAndWeaknessesText,
    ),
    isDefault: form.isDefault,
  };
}

export function createProjectRequests(projects) {
  return projects
    .filter(
      (project) =>
        project.projectName.trim() ||
        project.roleName.trim() ||
        project.startYearMonth ||
        project.endYearMonth ||
        project.description.trim() ||
        project.troubleshooting.trim() ||
        project.techStacksInput.trim(),
    )
    .map((project, index) => ({
      resumeProjectId: project.resumeProjectId ?? null,
      projectName: project.projectName.trim(),
      roleName: nullableText(project.roleName),
      startYearMonth: nullableYearMonth(
        project.startYearMonth,
      ),
      endYearMonth: nullableYearMonth(
        project.endYearMonth,
      ),
      description: nullableText(
        project.description,
      ),
      troubleshooting: nullableText(
        project.troubleshooting,
      ),
      techStacks: project.techStacksInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      sortOrder: index + 1,
    }));
}

function parseEducationSummary(summary) {
  const [schoolName = "", major = "", status = "재학", period = ""] =
    summary.split(" | ");
  const [startYearMonth = "", endYearMonth = ""] = period.split(" ~ ");

  return {
    ...createEmptyEducation(),
    schoolName,
    major,
    status,
    startYearMonth,
    endYearMonth,
  };
}

export function createResumeFormFromDetail(resume) {
  return {
    title: resume.title,
    name: resume.name,
    email: resume.email,
    phone: resume.phone ?? "",
    githubUrl: resume.githubUrl ?? "",
    blogUrl: resume.blogUrl ?? "",
    isDefault: resume.isDefault,
    education: resume.education.length
      ? resume.education.map(parseEducationSummary)
      : [createEmptyEducation()],
    experience: resume.experience.length
      ? resume.experience.map((experience) => ({
          ...createEmptyExperience(),
          ...experience,
          endYearMonth: experience.endYearMonth ?? "",
          responsibilities: experience.responsibilities ?? "",
        }))
      : [createEmptyExperience()],
    projects: resume.projects.length
      ? resume.projects.map((project) => ({
          ...createEmptyProject(),
          resumeProjectId: project.resumeProjectId,
          projectName: project.projectName,
          roleName: project.roleName ?? "",
          startYearMonth: project.startYearMonth ?? "",
          endYearMonth: project.endYearMonth ?? "",
          description: project.description ?? "",
          troubleshooting: project.troubleshooting ?? "",
          techStacksInput: project.techStacks.join(", "),
        }))
      : [createEmptyProject()],
    selectedSkills: resume.resumeSkillNames.map((skillName, index) => ({
      skillId: `stored-${index}`,
      skillName,
    })),
    summaryText: resume.summaryText ?? "",
    motivationText: resume.motivationText ?? "",
    strengthsAndWeaknessesText: resume.strengthsAndWeaknessesText ?? "",
  };
}