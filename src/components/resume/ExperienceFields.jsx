import {
  createEmptyExperience,
} from "../../api/resume/resume.mappers";
import {
  ResumeFormSection,
} from "./ResumeFormSection";

const EMPLOYMENT_TYPE_OPTIONS = [
  ["FULL_TIME", "정규직"],
  ["CONTRACT", "계약직"],
  ["INTERN", "인턴"],
  ["FREELANCER", "프리랜서"],
];

export function ExperienceFields({
  items,
  onChange,
  onAdd,
  onRemove,
}) {
  return (
    <ResumeFormSection
      id="experience"
      title="경력"
      description="회사, 직무, 고용 형태와 주요 성과를 입력해 주세요."
      action={
        <button
          className="resume-section-add"
          type="button"
          onClick={() =>
            onAdd(createEmptyExperience())
          }
        >
          + 경력 추가
        </button>
      }
    >
      {items.length === 0 && (
        <p className="resume-section-empty">
          경력이 없다면 이 항목을 비워두어도 됩니다.
        </p>
      )}

      {items.map((experience, index) => (
        <fieldset
          className="resume-repeat-card"
          key={experience.clientId}
        >
          <legend>경력 {index + 1}</legend>
          <button
            className="resume-repeat-card__remove"
            type="button"
            onClick={() => onRemove(index)}
          >
            삭제
          </button>

          <div className="resume-field-grid resume-field-grid--two">
            <label>
              회사명 <em>*</em>
              <input
                value={experience.companyName}
                onChange={(event) =>
                  onChange(
                    index,
                    "companyName",
                    event.target.value,
                  )
                }
                placeholder="회사명을 입력해 주세요."
              />
            </label>
            <label>
              직무·직책 <em>*</em>
              <input
                value={experience.roleName}
                onChange={(event) =>
                  onChange(
                    index,
                    "roleName",
                    event.target.value,
                  )
                }
                placeholder="예: 백엔드 개발자"
              />
            </label>
          </div>

          <div className="resume-field-grid resume-field-grid--three">
            <label>
              고용 형태 <em>*</em>
              <select
                value={experience.employmentType}
                onChange={(event) =>
                  onChange(
                    index,
                    "employmentType",
                    event.target.value,
                  )
                }
              >
                {EMPLOYMENT_TYPE_OPTIONS.map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label>
              입사 연월 <em>*</em>
              <input
                type="month"
                value={experience.startYearMonth}
                onChange={(event) =>
                  onChange(
                    index,
                    "startYearMonth",
                    event.target.value,
                  )
                }
              />
            </label>
            <label>
              퇴사 연월
              <input
                type="month"
                value={experience.endYearMonth}
                disabled={experience.isCurrent}
                onChange={(event) =>
                  onChange(
                    index,
                    "endYearMonth",
                    event.target.value,
                  )
                }
              />
            </label>
          </div>

          <label className="resume-check-field">
            <input
              type="checkbox"
              checked={experience.isCurrent}
              onChange={(event) =>
                onChange(
                  index,
                  "isCurrent",
                  event.target.checked,
                )
              }
            />
            현재 재직 중
          </label>

          <label>
            주요 업무 및 성과
            <textarea
              value={experience.responsibilities}
              onChange={(event) =>
                onChange(
                  index,
                  "responsibilities",
                  event.target.value,
                )
              }
              placeholder="담당 업무와 성과를 구체적으로 작성해 주세요."
              rows="5"
            />
          </label>
        </fieldset>
      ))}
    </ResumeFormSection>
  );
}
