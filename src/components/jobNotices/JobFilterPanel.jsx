import {
  JOB_NOTICE_EXPERIENCE_LEVELS,
  JOB_NOTICE_EXPERIENCE_LEVEL_LABELS,
  JOB_NOTICE_JOB_ROLES,
  JOB_NOTICE_JOB_ROLE_LABELS,
} from "../../api/jobNotices/jobNotices.constants";

const LOCATION_OPTIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대전",
  "대구",
  "광주",
  "울산",
  "세종",
];

export function JobFilterPanel({
  filters,
  onChange,
  onReset,
  onApply,
  onOpenSkillSearch,
  isLoading = false,
}) {
  function handleSkillRemove(skillName) {
    onChange(
      "skillNames",
      filters.skillNames.filter(
        (currentSkillName) =>
          currentSkillName !== skillName,
      ),
    );
  }

  return (
    <aside
      className="job-filter-panel"
      aria-label="채용공고 필터"
    >
      <div className="job-filter-panel__header">
        <h2>필터</h2>

        <button type="button" onClick={onReset}>
          전체 초기화
        </button>
      </div>

      <label className="job-filter-panel__field">
        <span>직무</span>

        <select
          value={filters.jobRole}
          onChange={(event) =>
            onChange(
              "jobRole",
              event.target.value,
            )
          }
        >
          <option value="">전체 직무</option>

          {JOB_NOTICE_JOB_ROLES.map(
            (jobRole) => (
              <option
                key={jobRole}
                value={jobRole}
              >
                {
                  JOB_NOTICE_JOB_ROLE_LABELS[
                    jobRole
                  ]
                }
              </option>
            ),
          )}
        </select>
      </label>

      <section className="job-filter-panel__section">
        <h3>기술 스택</h3>

        {filters.skillNames.length > 0 ? (
          <div className="job-filter-panel__skills">
            {filters.skillNames.map(
              (skillName) => (
                <button
                  key={skillName}
                  type="button"
                  aria-label={`${skillName} 필터 제거`}
                  onClick={() =>
                    handleSkillRemove(skillName)
                  }
                >
                  {skillName}
                  <span aria-hidden="true">×</span>
                </button>
              ),
            )}
          </div>
        ) : (
          <p className="job-filter-panel__empty">
            선택된 기술이 없습니다.
          </p>
        )}

        <button
          className="job-filter-panel__skill-search"
          type="button"
          onClick={onOpenSkillSearch}
        >
          + 기술 스택 더보기
        </button>
      </section>

      <fieldset className="job-filter-panel__section">
        <legend>경력</legend>

        <div className="job-filter-panel__experiences">
          {JOB_NOTICE_EXPERIENCE_LEVELS.map(
            (experienceLevel) => (
              <button
                key={experienceLevel}
                type="button"
                aria-pressed={
                  filters.experienceLevel ===
                  experienceLevel
                }
                onClick={() =>
                  onChange(
                    "experienceLevel",
                    experienceLevel,
                  )
                }
              >
                {
                  JOB_NOTICE_EXPERIENCE_LEVEL_LABELS[
                    experienceLevel
                  ]
                }
              </button>
            ),
          )}
        </div>
      </fieldset>

      <label className="job-filter-panel__field">
        <span>지역</span>

        <select
          value={filters.location}
          onChange={(event) =>
            onChange(
              "location",
              event.target.value,
            )
          }
        >
          <option value="">전체 지역</option>

          {LOCATION_OPTIONS.map((location) => (
            <option
              key={location}
              value={location}
            >
              {location}
            </option>
          ))}
        </select>
      </label>

      <p className="job-filter-panel__help">
        선택한 조건은 공고 목록에 적용됩니다.
        기술 스택은 여러 개 선택할 수 있어요.
      </p>

      <button
        className="job-filter-panel__apply"
        type="button"
        disabled={isLoading}
        onClick={onApply}
      >
        {isLoading ? "불러오는 중" : "공고 보기"}
      </button>
    </aside>
  );
}