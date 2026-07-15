import {
  CALENDAR_VIEWS,
} from "../../api/calendar/calendar.constants";
import {
  JOB_NOTICE_JOB_ROLES,
  JOB_NOTICE_JOB_ROLE_LABELS,
} from "../../api/jobNotices/jobNotices.constants";

export function CalendarControls({
  view,
  filters,
  isLoading,
  onViewChange,
  onFilterChange,
  onFilterReset,
  onSkillSearchOpen,
}) {
  const isAllView = view === CALENDAR_VIEWS.ALL;

  return (
    <section
      className="calendar-controls"
      aria-label="캘린더 보기 설정"
    >
      <div
        className="calendar-controls__tabs"
        role="tablist"
        aria-label="일정 종류"
      >
        <button
          type="button"
          role="tab"
          aria-selected={isAllView}
          onClick={() =>
            onViewChange(CALENDAR_VIEWS.ALL)
          }
        >
          전체 공고
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isAllView}
          onClick={() =>
            onViewChange(CALENDAR_VIEWS.BOOKMARKS)
          }
        >
          내 스크랩
        </button>
      </div>

      {isAllView && (
        <div className="calendar-controls__filters">
          <label>
            <span className="sr-only">직무</span>
            <select
              aria-label="직무 필터"
              value={filters.jobRole}
              disabled={isLoading}
              onChange={(event) =>
                onFilterChange(
                  "jobRole",
                  event.target.value,
                )
              }
            >
              <option value="">직무 전체</option>
              {JOB_NOTICE_JOB_ROLES.map((jobRole) => (
                <option key={jobRole} value={jobRole}>
                  {JOB_NOTICE_JOB_ROLE_LABELS[jobRole]}
                </option>
              ))}
            </select>
          </label>

          <button
            className="calendar-controls__skill"
            type="button"
            disabled={isLoading}
            onClick={onSkillSearchOpen}
          >
            {filters.skillNames.length > 0
              ? `기술 스택 ${filters.skillNames.length}개`
              : "기술 스택 전체"}
            <span aria-hidden="true">⌄</span>
          </button>

          {(filters.jobRole ||
            filters.skillNames.length > 0) && (
            <button
              className="calendar-controls__reset"
              type="button"
              onClick={onFilterReset}
            >
              초기화
            </button>
          )}
        </div>
      )}
    </section>
  );
}
