import { Link } from "react-router-dom";

import {
  CALENDAR_VIEWS,
} from "../../api/calendar/calendar.constants";
import {
  getDeadlineLabel,
  getEventDateKey,
  getEventTone,
  toDateKey,
} from "./calendar.utils";

function CalendarSummary({ summary }) {
  return (
    <div
      className="calendar-summary"
      aria-label="스크랩 일정 요약"
    >
      <div>
        <span>모집 중</span>
        <strong>{summary.openCount}</strong>
      </div>
      <div>
        <span>마감 임박</span>
        <strong>{summary.closingSoonCount}</strong>
      </div>
      <div>
        <span>마감</span>
        <strong>{summary.closedCount}</strong>
      </div>
    </div>
  );
}

export function SelectedDatePanel({
  selectedDate,
  events,
  view,
  summary,
  isLoading,
  errorMessage,
  requiresLogin,
  onRetry,
}) {
  const selectedDateKey = toDateKey(selectedDate);
  const selectedEvents = events.filter(
    (event) =>
      getEventDateKey(event.deadlineAt) ===
      selectedDateKey,
  );
  const dateLabel = new Intl.DateTimeFormat(
    "ko-KR",
    {
      month: "long",
      day: "numeric",
      weekday: "long",
    },
  ).format(selectedDate);

  return (
    <aside className="selected-date-panel">
      {view === CALENDAR_VIEWS.BOOKMARKS &&
        !requiresLogin && (
          <CalendarSummary summary={summary} />
        )}

      <div className="selected-date-panel__heading">
        <div>
          <h2>{dateLabel}</h2>
          <p>마감 일정 {selectedEvents.length}개</p>
        </div>
        <span>{selectedEvents.length}</span>
      </div>

      <div className="calendar-legend">
        <span>모집 중</span>
        <span>마감 임박</span>
        <span>마감</span>
      </div>

      {requiresLogin ? (
        <div className="selected-date-panel__state">
          <strong>
            스크랩 일정은 로그인 후 볼 수 있어요.
          </strong>
          <p>
            저장한 공고의 마감 일정과 월간 현황을
            확인해보세요.
          </p>
          <Link to="/auth">로그인하기</Link>
        </div>
      ) : isLoading ? (
        <div
          className="selected-date-panel__state"
          aria-live="polite"
        >
          일정을 불러오고 있어요.
        </div>
      ) : errorMessage ? (
        <div
          className="selected-date-panel__state"
          role="alert"
        >
          <strong>일정을 불러오지 못했습니다.</strong>
          <p>{errorMessage}</p>
          <button type="button" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      ) : selectedEvents.length === 0 ? (
        <div className="selected-date-panel__state">
          <strong>이 날짜에는 마감 일정이 없어요.</strong>
          <p>다른 날짜를 선택해 확인해보세요.</p>
        </div>
      ) : (
        <ul className="selected-date-panel__list">
          {selectedEvents.map((event) => (
            <li key={event.jobNoticeId}>
              <article className="calendar-deadline-card">
                <div className="calendar-deadline-card__meta">
                  <span>{event.companyName}</span>
                  <em
                    className={`calendar-deadline-card__status calendar-deadline-card__status--${getEventTone(
                      event,
                    )}`}
                  >
                    {event.recruitStatusText} ·{
                      " "
                    }
                    {getDeadlineLabel(event)}
                  </em>
                </div>
                <h3>{event.title}</h3>
                <time dateTime={event.deadlineAt}>
                  {new Intl.DateTimeFormat("ko-KR", {
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(event.deadlineAt))}
                </time>
                <Link
                  to={`/jobs/${event.jobNoticeId}`}
                >
                  공고 상세 보기 →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}

      {view === CALENDAR_VIEWS.ALL && (
        <div className="selected-date-panel__saved-hint">
          <strong>스크랩한 공고만 모아보기</strong>
          <p>
            내 스크랩 탭에서 저장한 공고 일정만
            확인할 수 있어요.
          </p>
        </div>
      )}
    </aside>
  );
}
