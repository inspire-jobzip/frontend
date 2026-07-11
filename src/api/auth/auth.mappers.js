export class SignupFormValidationError extends Error {
  constructor(field, message) {
    super(message);

    this.name = "SignupFormValidationError";
    this.field = field;
  }
}

function parseCareerYears(formValues) {
  // 백엔드는 신입 회원의 경력 연차를 빈 값이 아닌 0으로 받는다.
  if (formValues.careerStatus === "NEW") {
    return 0;
  }

  const careerYears = Number(
    formValues.careerYearsInput.trim(),
  );

  if (
    !Number.isFinite(careerYears) ||
    careerYears < 0
  ) {
    throw new SignupFormValidationError(
      "careerYearsInput",
      "올바른 경력 연차를 입력해 주세요.",
    );
  }

  return careerYears;
}

function getPreferredSkillNames(selectedSkills) {
  const skillNames = selectedSkills.map(
    (skill) => skill.skillName.trim(),
  );

  // API에는 UI 식별자가 아닌 중복·공백이 제거된 기술명만 전달한다.
  return [...new Set(skillNames)].filter(Boolean);
}

export function createSignupRequest(formValues) {
  // 폼 전용 상태를 API 계약에 맞는 요청 객체로 변환하는 경계이다.
  if (!formValues.desiredJobRole) {
    throw new SignupFormValidationError(
      "desiredJobRole",
      "희망 직무를 선택해 주세요.",
    );
  }

  return {
    email: formValues.email.trim(),
    password: formValues.password,
    desiredJobRole: formValues.desiredJobRole,
    careerStatus: formValues.careerStatus,
    careerYears: parseCareerYears(formValues),
    preferredSkillNames: getPreferredSkillNames(
      formValues.selectedSkills,
    ),
  };
}