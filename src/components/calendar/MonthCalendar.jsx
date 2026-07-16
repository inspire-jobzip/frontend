import { useMemo } from "react";

import {
  getCalendarDays,
  getEventDateKey,
  getEventTone,
  toDateKey,
} from "./calendar.utils";

const WEEKDAYS = [
  "일",
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
];

export function MonthCalendar({
  visibleMonth,
  selectedDate,
  events,
  isLoading,
  onDateSelect,
  onMonthMove,
  onToday,
}) {
  const days = useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth],
  );
  const eventsByDate = useMemo(() => {
    const groupedEvents = new Map();

    events.forEach((event) => {
      const dateKey = getEventDateKey(
        event.deadlineAt,
      );
      const dateEvents =
        groupedEvents.get(dateKey) ?? [];
      groupedEvents.set(dateKey, [
        ...dateEvents,
        event,
      ]);
    });

    return groupedEvents;
  }, [events]);

  const selectedDateKey = toDateKey(selectedDate);
  const todayKey = toDateKey(new Date());
  const visibleMonthNumber =
    visibleMonth.getMonth();

  return (
    <section className="month-calendar">
      <header className="month-calendar__header">
        <h2>
          {visibleMonth.getFullYear()}년{" "}
          {visibleMonth.getMonth() + 1}월
        </h2>

        <div className="month-calendar__controls">
          <button
            className="month-calendar__today"
            type="button"
            onClick={onToday}
          >
            오늘
          </button>
          <div className="month-calendar__navigation">
            <button
              type="button"
              aria-label="이전 달"
              onClick={() => onMonthMove(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="다음 달"
              onClick={() => onMonthMove(1)}
            >
              ›
            </button>
          </div>
        </div>
      </header>

      <div
        className="month-calendar__weekdays"
        aria-hidden="true"
      >
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div
        className={`month-calendar__grid${
          isLoading ? " is-loading" : ""
        }`}
      >
        {days.map((date) => {
          const dateKey = toDateKey(date);
          const dateEvents =
            eventsByDate.get(dateKey) ?? [];
          const isOutsideMonth =
            date.getMonth() !==
            visibleMonthNumber;
          const isSelected =
            dateKey === selectedDateKey;
          const isToday = dateKey === todayKey;

          return (
            <button
              className="month-calendar__day"
              key={dateKey}
              type="button"
              data-outside={isOutsideMonth}
              data-selected={isSelected}
              data-today={isToday}
              aria-pressed={isSelected}
              aria-label={`${date.getMonth() + 1}월 ${
                date.getDate()
              }일, 일정 ${dateEvents.length}개`}
              onClick={() => onDateSelect(date)}
            >
              <span className="month-calendar__date">
                {date.getDate()}
              </span>

              <span className="month-calendar__events">
                {dateEvents
                  .slice(0, 2)
                  .map((event) => (
                    <span
                      className={`calendar-event-chip calendar-event-chip--${getEventTone(
                        event,
                      )}`}
                      key={event.jobNoticeId}
                    >
                      {event.companyName} · {event.title}
                    </span>
                  ))}

                {dateEvents.length > 2 && (
                  <span className="month-calendar__more">
                    +{dateEvents.length - 2}개
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
