import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  getAuthSession,
} from "../api/auth/auth.session";
import {
  createEmptyEducation,
  createEmptyExperience,
  createEmptyProject,
} from "../api/resume/resume.mappers";
import {
  EducationFields,
} from "../components/resume/EducationFields";
import {
  ExperienceFields,
} from "../components/resume/ExperienceFields";
import {
  ProjectFields,
} from "../components/resume/ProjectFields";
import {
  ResumeFormSection,
} from "../components/resume/ResumeFormSection";
import {
  ResumeHeader,
} from "../components/resume/ResumeHeader";
import {
  ResumeSkillPicker,
} from "../components/resume/ResumeSkillPicker";
import {
  useCreateResume,
} from "../hooks/resume/useCreateResume";
import "../styles/resume-create.css";

function createInitialForm(session) {
  return {
    title: "",
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    phone: "",
    githubUrl: "",
    blogUrl: "",
    isDefault: false,
    education: [createEmptyEducation()],
    experience: [createEmptyExperience()],
    projects: [createEmptyProject()],
    selectedSkills: [],
    summaryText: "",
    motivationText: "",
    strengthsAndWeaknessesText: "",
  };
}

function updateListItem(items, index, key, value) {
  return items.map((item, itemIndex) =>
    itemIndex === index
      ? { ...item, [key]: value }
      : item,
  );
}

export function ResumeCreatePage() {
  const navigate = useNavigate();
  const session = getAuthSession();
  const accessToken = session?.accessToken;
  const [form, setForm] = useState(() =>
    createInitialForm(session),
  );
  const {
    isSaving,
    errorMessage,
    partiallySavedResumeId,
    saveResume,
  } = useCreateResume(accessToken);

  if (!accessToken) {
    return <Navigate to="/auth" replace />;
  }

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateRepeatingField(
    collection,
    index,
    key,
    value,
  ) {
    setForm((current) => ({
      ...current,
      [collection]: updateListItem(
        current[collection],
        index,
        key,
        value,
      ),
    }));
  }

  function addRepeatingItem(collection, item) {
    setForm((current) => ({
      ...current,
      [collection]: [
        ...current[collection],
        item,
      ],
    }));
  }

  function removeRepeatingItem(collection, index) {
    setForm((current) => ({
      ...current,
      [collection]: current[collection].filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const createdResume = await saveResume(form);
      if (createdResume) {
        navigate("/mypage", { replace: true });
      }
    } catch {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="resume-create-page">
      <ResumeHeader />

      <main>
        <header className="resume-create-intro">
          <div>
            <h1>이력서 작성</h1>
            <p>
              모든 항목을 한 화면에서 내려가며
              작성하세요.
            </p>
          </div>

          <div className="resume-create-intro__actions">
            <span>
              {isSaving ? "저장 중" : "저장 전"}
            </span>
            <button
              type="submit"
              form="resume-create-form"
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </header>

        {errorMessage && (
          <section
            className="resume-save-error"
            role="alert"
          >
            <strong>{errorMessage}</strong>
            {partiallySavedResumeId && (
              <p>
                저장된 이력서 번호: {partiallySavedResumeId}
              </p>
            )}
          </section>
        )}

        <form
          id="resume-create-form"
          className="resume-long-form"
          onSubmit={handleSubmit}
        >
          <ResumeFormSection
            id="basic-info"
            title="기본 정보"
            description="이력서 제목과 지원자 연락 정보를 입력해 주세요."
            action={
              <span className="resume-required-badge">
                필수
              </span>
            }
          >
            <label>
              이력서 제목 <em>*</em>
              <input
                required
                value={form.title}
                onChange={(event) =>
                  updateField(
                    "title",
                    event.target.value,
                  )
                }
                placeholder="예: 백엔드 개발자 지원 이력서"
              />
            </label>

            <div className="resume-field-grid resume-field-grid--two">
              <label>
                이름 <em>*</em>
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value,
                    )
                  }
                  placeholder="이름을 입력해 주세요."
                />
              </label>
              <label>
                이메일 <em>*</em>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value,
                    )
                  }
                  placeholder="name@example.com"
                />
              </label>
            </div>

            <label>
              전화번호
              <input
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value,
                  )
                }
                placeholder="010-0000-0000"
              />
            </label>

            <div className="resume-field-grid resume-field-grid--two">
              <label>
                GitHub URL
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={(event) =>
                    updateField(
                      "githubUrl",
                      event.target.value,
                    )
                  }
                  placeholder="https://github.com/username"
                />
              </label>
              <label>
                블로그 URL
                <input
                  type="url"
                  value={form.blogUrl}
                  onChange={(event) =>
                    updateField(
                      "blogUrl",
                      event.target.value,
                    )
                  }
                  placeholder="https://velog.io/@username"
                />
              </label>
            </div>

            <label className="resume-default-setting">
              <span>
                <strong>기본 이력서로 설정</strong>
                <small>
                  공고 비교와 AI 분석에 대표
                  이력서로 사용됩니다.
                </small>
              </span>
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(event) =>
                  updateField(
                    "isDefault",
                    event.target.checked,
                  )
                }
              />
            </label>
          </ResumeFormSection>

          <EducationFields
            items={form.education}
            onChange={(index, key, value) =>
              updateRepeatingField(
                "education",
                index,
                key,
                value,
              )
            }
            onAdd={(item) =>
              addRepeatingItem("education", item)
            }
            onRemove={(index) =>
              removeRepeatingItem("education", index)
            }
          />

          <ExperienceFields
            items={form.experience}
            onChange={(index, key, value) =>
              updateRepeatingField(
                "experience",
                index,
                key,
                value,
              )
            }
            onAdd={(item) =>
              addRepeatingItem("experience", item)
            }
            onRemove={(index) =>
              removeRepeatingItem("experience", index)
            }
          />

          <ProjectFields
            items={form.projects}
            onChange={(index, key, value) =>
              updateRepeatingField(
                "projects",
                index,
                key,
                value,
              )
            }
            onAdd={(item) =>
              addRepeatingItem("projects", item)
            }
            onRemove={(index) =>
              removeRepeatingItem("projects", index)
            }
          />

          <ResumeSkillPicker
            accessToken={accessToken}
            selectedSkills={form.selectedSkills}
            onChange={(selectedSkills) =>
              updateField(
                "selectedSkills",
                selectedSkills,
              )
            }
          />

          <ResumeFormSection
            id="summary"
            title="자기소개"
            description="개발자로서의 방향성과 핵심 강점을 요약해 주세요."
          >
            <label>
              자기소개 요약
              <textarea
                rows="7"
                value={form.summaryText}
                onChange={(event) =>
                  updateField(
                    "summaryText",
                    event.target.value,
                  )
                }
                placeholder="개발자로서의 방향성, 주력 기술, 관심 분야를 3~5줄로 작성해 주세요."
              />
            </label>
          </ResumeFormSection>

          <ResumeFormSection
            id="motivation"
            title="지원동기"
            description="지원 직무와 연결되는 경험과 목표를 작성해 주세요."
          >
            <label>
              지원동기
              <textarea
                rows="8"
                value={form.motivationText}
                onChange={(event) =>
                  updateField(
                    "motivationText",
                    event.target.value,
                  )
                }
                placeholder="지원하게 된 계기와 입사 후 기여하고 싶은 내용을 작성해 주세요."
              />
            </label>
          </ResumeFormSection>

          <ResumeFormSection
            id="strengths-and-weaknesses"
            title="장단점"
            description="업무와 연결되는 강점과 개선 중인 단점을 작성해 주세요."
          >
            <label>
              본인의 장단점
              <textarea
                rows="8"
                value={
                  form.strengthsAndWeaknessesText
                }
                onChange={(event) =>
                  updateField(
                    "strengthsAndWeaknessesText",
                    event.target.value,
                  )
                }
                placeholder="구체적인 경험을 근거로 장점과 단점을 작성해 주세요."
              />
            </label>
          </ResumeFormSection>

          <footer className="resume-submit-bar">
            <div>
              <strong>작성 내용을 확인하셨나요?</strong>
              <p>
                필수 항목을 입력한 뒤 이력서를
                저장해 주세요.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate("/mypage")}
                disabled={isSaving}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSaving}
              >
                {isSaving
                  ? "저장 중..."
                  : "이력서 저장하기"}
              </button>
            </div>
          </footer>
        </form>
      </main>
    </div>
  );
}
