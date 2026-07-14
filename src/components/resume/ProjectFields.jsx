import {
  createEmptyProject,
} from "../../api/resume/resume.mappers";
import {
  ResumeFormSection,
} from "./ResumeFormSection";

export function ProjectFields({
  items,
  onChange,
  onAdd,
  onRemove,
}) {
  return (
    <ResumeFormSection
      id="projects"
      title="프로젝트"
      description="프로젝트 역할과 사용 기술, 문제 해결 경험을 작성해 주세요."
      action={
        <button
          className="resume-section-add"
          type="button"
          onClick={() =>
            onAdd(createEmptyProject())
          }
        >
          + 프로젝트 추가
        </button>
      }
    >
      {items.length === 0 && (
        <p className="resume-section-empty">
          프로젝트 추가 버튼을 눌러 경험을 입력해
          주세요.
        </p>
      )}

      {items.map((project, index) => (
        <fieldset
          className="resume-repeat-card"
          key={project.clientId}
        >
          <legend>프로젝트 {index + 1}</legend>
          <button
            className="resume-repeat-card__remove"
            type="button"
            onClick={() => onRemove(index)}
          >
            삭제
          </button>

          <div className="resume-field-grid resume-field-grid--two">
            <label>
              프로젝트명 <em>*</em>
              <input
                value={project.projectName}
                onChange={(event) =>
                  onChange(
                    index,
                    "projectName",
                    event.target.value,
                  )
                }
                placeholder="프로젝트명을 입력해 주세요."
              />
            </label>
            <label>
              담당 역할
              <input
                value={project.roleName}
                onChange={(event) =>
                  onChange(
                    index,
                    "roleName",
                    event.target.value,
                  )
                }
                placeholder="예: 백엔드 개발"
              />
            </label>
          </div>

          <div className="resume-field-grid resume-field-grid--three">
            <label>
              시작 연월
              <input
                type="month"
                value={project.startYearMonth}
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
              종료 연월
              <input
                type="month"
                value={project.endYearMonth}
                onChange={(event) =>
                  onChange(
                    index,
                    "endYearMonth",
                    event.target.value,
                  )
                }
              />
            </label>
            <label>
              사용 기술
              <input
                value={project.techStacksInput}
                onChange={(event) =>
                  onChange(
                    index,
                    "techStacksInput",
                    event.target.value,
                  )
                }
                placeholder="Java, Spring Boot"
              />
            </label>
          </div>

          <label>
            프로젝트 설명
            <textarea
              value={project.description}
              onChange={(event) =>
                onChange(
                  index,
                  "description",
                  event.target.value,
                )
              }
              placeholder="프로젝트의 목적과 주요 기능을 작성해 주세요."
              rows="5"
            />
          </label>

          <label>
            트러블슈팅 경험
            <textarea
              value={project.troubleshooting}
              onChange={(event) =>
                onChange(
                  index,
                  "troubleshooting",
                  event.target.value,
                )
              }
              placeholder="문제 상황과 해결 과정, 결과를 작성해 주세요."
              rows="6"
            />
          </label>
        </fieldset>
      ))}
    </ResumeFormSection>
  );
}
