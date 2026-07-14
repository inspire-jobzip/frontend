import {
  createEmptyEducation,
} from "../../api/resume/resume.mappers";
import {
  ResumeFormSection,
} from "./ResumeFormSection";

export function EducationFields({
  items,
  onChange,
  onAdd,
  onRemove,
}) {
  return (
    <ResumeFormSection
      id="education"
      title="학력"
      description="학교와 전공, 재학 기간을 입력해 주세요."
      action={
        <button
          className="resume-section-add"
          type="button"
          onClick={() =>
            onAdd(createEmptyEducation())
          }
        >
          + 학력 추가
        </button>
      }
    >
      {items.length === 0 && (
        <p className="resume-section-empty">
          등록된 학력이 없습니다. 학력 추가 버튼을
          눌러 입력해 주세요.
        </p>
      )}

      {items.map((education, index) => (
        <fieldset
          className="resume-repeat-card"
          key={education.clientId}
        >
          <legend>학력 {index + 1}</legend>
          <button
            className="resume-repeat-card__remove"
            type="button"
            onClick={() => onRemove(index)}
          >
            삭제
          </button>

          <div className="resume-field-grid resume-field-grid--two">
            <label>
              학교명 <em>*</em>
              <input
                value={education.schoolName}
                onChange={(event) =>
                  onChange(
                    index,
                    "schoolName",
                    event.target.value,
                  )
                }
                placeholder="학교명을 입력해 주세요."
              />
            </label>
            <label>
              전공
              <input
                value={education.major}
                onChange={(event) =>
                  onChange(
                    index,
                    "major",
                    event.target.value,
                  )
                }
                placeholder="전공을 입력해 주세요."
              />
            </label>
          </div>

          <div className="resume-field-grid resume-field-grid--three">
            <label>
              학적 상태 <em>*</em>
              <select
                value={education.status}
                onChange={(event) =>
                  onChange(
                    index,
                    "status",
                    event.target.value,
                  )
                }
              >
                <option value="재학">재학</option>
                <option value="휴학">휴학</option>
                <option value="졸업">졸업</option>
                <option value="중퇴">중퇴</option>
              </select>
            </label>
            <label>
              입학 연월
              <input
                type="month"
                value={education.startYearMonth}
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
              졸업 연월
              <input
                type="month"
                value={education.endYearMonth}
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
        </fieldset>
      ))}
    </ResumeFormSection>
  );
}
