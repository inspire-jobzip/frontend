import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createProfileSkills,
  createUpdateProfileRequest,
} from "../../api/myPage/myPage.mappers";
import {
  CareerStatusToggle,
} from "../auth/CareerStatusToggle";
import {
  JobRoleChips,
} from "../auth/JobRoleChips";
import {
  SkillSearchModal,
} from "../auth/SkillSearchModal";

function createInitialForm(profile) {
  return {
    desiredJobRole: profile.desiredJobRole,
    careerStatus: profile.careerStatus,
    careerYearsInput: String(
      profile.careerStatus === "EXPERIENCED"
        ? profile.careerYears
        : "",
    ),
    selectedSkills: createProfileSkills(
      profile.preferredSkillNames,
    ),
  };
}

export function ProfileEditModal({
  isOpen,
  profile,
  isSaving,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(() =>
    createInitialForm(profile),
  );
  const [isSkillSearchOpen, setIsSkillSearchOpen] =
    useState(false);
  const [submitError, setSubmitError] =
    useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(createInitialForm(profile));
    setSubmitError("");
  }, [isOpen, profile]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (
        event.key === "Escape" &&
        !isSkillSearchOpen &&
        !isSaving
      ) {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    isSaving,
    isSkillSearchOpen,
    onClose,
  ]);

  const initialRequest = useMemo(
    () =>
      createUpdateProfileRequest({
        ...createInitialForm(profile),
        careerYears:
          profile.careerStatus ===
          "EXPERIENCED"
            ? profile.careerYears
            : 0,
      }),
    [profile],
  );

  const currentRequest = useMemo(
    () =>
      createUpdateProfileRequest({
        desiredJobRole:
          form.desiredJobRole,
        careerStatus: form.careerStatus,
        careerYears:
          form.careerYearsInput || 0,
        selectedSkills: form.selectedSkills,
      }),
    [form],
  );

  const isDirty =
    JSON.stringify(initialRequest) !==
    JSON.stringify(currentRequest);
  const isValid = Boolean(
    form.desiredJobRole &&
      form.selectedSkills.length > 0 &&
      (form.careerStatus === "NEW" ||
        Number(form.careerYearsInput) >= 0),
  );

  function updateForm(name, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
    setSubmitError("");
  }

  function handleCareerStatusChange(status) {
    setForm((currentForm) => ({
      ...currentForm,
      careerStatus: status,
      careerYearsInput:
        status === "NEW"
          ? ""
          : currentForm.careerYearsInput,
    }));
    setSubmitError("");
  }

  function handleSkillRemove(skillId) {
    updateForm(
      "selectedSkills",
      form.selectedSkills.filter(
        (skill) => skill.skillId !== skillId,
      ),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await onSave(currentRequest);
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "프로필을 수정하지 못했습니다.",
      );
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="profile-edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
      >
        <button
          className="profile-edit-modal__backdrop"
          type="button"
          aria-label="프로필 수정 닫기"
          disabled={isSaving}
          onClick={onClose}
        />

        <section className="profile-edit-modal__content">
          <header>
            <div>
              <h2 id="profile-edit-title">
                프로필 수정
              </h2>
              <p>
                희망 직무와 경력, 관심 기술을
                수정할 수 있습니다.
              </p>
            </div>

            <button
              type="button"
              aria-label="닫기"
              disabled={isSaving}
              onClick={onClose}
            >
              ×
            </button>
          </header>

          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>희망 직무</legend>
              <JobRoleChips
                selectedRole={
                  form.desiredJobRole
                }
                onChange={(role) =>
                  updateForm(
                    "desiredJobRole",
                    role,
                  )
                }
              />
            </fieldset>

            <fieldset>
              <legend>경력 상태</legend>
              <CareerStatusToggle
                selectedStatus={
                  form.careerStatus
                }
                onChange={
                  handleCareerStatusChange
                }
              />
            </fieldset>

            {form.careerStatus ===
              "EXPERIENCED" && (
              <label className="profile-edit-modal__years">
                <span>경력 연수</span>
                <span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={
                      form.careerYearsInput
                    }
                    onChange={(event) =>
                      updateForm(
                        "careerYearsInput",
                        event.target.value,
                      )
                    }
                    required
                  />
                  년
                </span>
              </label>
            )}

            <fieldset>
              <legend>관심 기술</legend>
              <div className="profile-edit-modal__skills">
                {form.selectedSkills.map(
                  (skill) => (
                    <button
                      key={skill.skillId}
                      type="button"
                      aria-label={`${skill.skillName} 삭제`}
                      onClick={() =>
                        handleSkillRemove(
                          skill.skillId,
                        )
                      }
                    >
                      {skill.skillName}
                      <span aria-hidden="true">
                        ×
                      </span>
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() =>
                    setIsSkillSearchOpen(true)
                  }
                >
                  + 검색
                </button>
              </div>
            </fieldset>

            {submitError && (
              <p
                className="profile-edit-modal__error"
                role="alert"
              >
                {submitError}
              </p>
            )}

            <footer>
              <button
                type="button"
                disabled={isSaving}
                onClick={onClose}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={
                  !isDirty ||
                  !isValid ||
                  isSaving
                }
              >
                {isSaving
                  ? "저장 중..."
                  : "변경사항 저장"}
              </button>
            </footer>
          </form>
        </section>
      </div>

      <SkillSearchModal
        isOpen={isSkillSearchOpen}
        desiredJobRole={form.desiredJobRole}
        selectedSkills={form.selectedSkills}
        onChange={(skills) =>
          updateForm("selectedSkills", skills)
        }
        onClose={() =>
          setIsSkillSearchOpen(false)
        }
      />
    </>
  );
}
