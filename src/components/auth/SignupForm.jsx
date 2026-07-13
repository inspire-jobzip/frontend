import { useState } from "react";

import {
  CareerStatusToggle,
} from "./CareerStatusToggle";
import {
  JobRoleChips,
} from "./JobRoleChips";
import {
  SkillSearchModal,
} from "./SkillSearchModal";
import {
  useSignup,
} from "../../hooks/auth/useSignup";

export function SignupForm({
  recommendedSkills = [],
  onSignupSuccess = () => {},
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [
    desiredJobRole,
    setDesiredJobRole,
  ] = useState(null);
  const [
    careerStatus,
    setCareerStatus,
  ] = useState("NEW");
  const [
    careerYearsInput,
    setCareerYearsInput,
  ] = useState("");
  const [
    selectedSkills,
    setSelectedSkills,
  ] = useState([]);
  const [
    isSkillModalOpen,
    setIsSkillModalOpen,
  ] = useState(false);

  const {
    signup,
    isLoading,
    errorMessage,
    clearError,
  } = useSignup();

  async function handleSubmit(event) {
    event.preventDefault();

    const signupData = await signup({
      email,
      password,
      desiredJobRole,
      careerStatus,
      careerYearsInput,
      selectedSkills,
    });

    if (signupData) {
      onSignupSuccess(signupData);
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
    clearError();
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    clearError();
  }

  function handleJobRoleChange(role) {
    setDesiredJobRole(role);
    clearError();
  }

  function handleCareerStatusChange(status) {
    setCareerStatus(status);

    // 경력에서 신입으로 되돌아가면 숨겨진 연차 값이 제출되지 않게 초기화한다.
    if (status === "NEW") {
      setCareerYearsInput("");
    }

    clearError();
  }

  function handleCareerYearsChange(event) {
    setCareerYearsInput(event.target.value);
    clearError();
  }

  function handleSkillRemove(skillId) {
    setSelectedSkills((currentSkills) =>
      currentSkills.filter(
        (skill) => skill.skillId !== skillId,
      ),
    );
  }

  return (
    <>
      <form
        className="signup-form"
        onSubmit={handleSubmit}
      >
        <div className="signup-form__header">
          <h2>계정을 만들어볼까요?</h2>
          <p>
            기본 정보와 관심 직무를 알려주세요.
          </p>
        </div>

        <div className="signup-form__field">
          <label htmlFor="signup-email">
            이메일
          </label>

          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="name@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="signup-form__field">
          <label htmlFor="signup-password">
            비밀번호
          </label>

          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="8자 이상 입력해 주세요"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <fieldset className="signup-form__group">
          <legend>희망 직무</legend>

          <JobRoleChips
            selectedRole={desiredJobRole}
            onChange={handleJobRoleChange}
          />
        </fieldset>

        <fieldset className="signup-form__group">
          <legend>경력 구분</legend>

          <CareerStatusToggle
            selectedStatus={careerStatus}
            onChange={
              handleCareerStatusChange
            }
          />
        </fieldset>

        {careerStatus === "EXPERIENCED" && (
          <div className="signup-form__field">
            <label htmlFor="career-years">
              경력 연차
            </label>

            <div className="signup-form__years">
              <input
                id="career-years"
                type="number"
                value={careerYearsInput}
                onChange={
                  handleCareerYearsChange
                }
                placeholder="예: 3"
                min="0"
                step="1"
                required
              />

              <span>년</span>
            </div>
          </div>
        )}

        <fieldset className="signup-form__group">
          <legend>관심 기술</legend>

          <div className="signup-form__skills">
            {selectedSkills.map((skill) => (
              <button
                key={skill.skillId}
                type="button"
                onClick={() =>
                  handleSkillRemove(
                    skill.skillId,
                  )
                }
                aria-label={
                  `${skill.skillName} 삭제`
                }
              >
                {skill.skillName}
                <span aria-hidden="true">
                  ×
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setIsSkillModalOpen(true)
              }
            >
              + 검색
            </button>
          </div>
        </fieldset>

        {errorMessage && (
          <p
            className="signup-form__error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        <button
          className="signup-form__submit"
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "가입 중..."
            : "회원가입"}
        </button>
      </form>

      {/* 모달에서 선택 완료한 경우에만 selectedSkills가 실제 폼에 반영된다. */}
      <SkillSearchModal
        isOpen={isSkillModalOpen}
        desiredJobRole={desiredJobRole}
        selectedSkills={selectedSkills}
        recommendedSkills={
          recommendedSkills
        }
        onChange={setSelectedSkills}
        onClose={() =>
          setIsSkillModalOpen(false)
        }
      />
    </>
  );
}