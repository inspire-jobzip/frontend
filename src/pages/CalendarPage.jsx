import { useState } from "react";

import {
  CalendarControls,
} from "../components/calendar/CalendarControls";
import {
  CalendarHeader,
} from "../components/calendar/CalendarHeader";
import {
  MonthCalendar,
} from "../components/calendar/MonthCalendar";
import {
  SelectedDatePanel,
} from "../components/calendar/SelectedDatePanel";
import {
  JobSkillSearchModal,
} from "../components/jobNotices/JobSkillSearchModal";
import {
  useCalendar,
} from "../hooks/calendar/useCalendar";
import "../styles/job-notices.css";
import "../styles/calendar.css";

export function CalendarPage({
  authSession,
  onLogout,
}) {
  const [isSkillSearchOpen, setIsSkillSearchOpen] =
    useState(false);
  const {
    visibleMonth,
    selectedDate,
    view,
    filters,
    events,
    summary,
    isLoading,
    errorMessage,
    requiresLogin,
    setSelectedDate,
    moveMonth,
    goToToday,
    changeView,
    changeFilter,
    resetFilters,
    retry,
  } = useCalendar({
    accessToken: authSession?.accessToken,
  });

  return (
    <div className="calendar-page">
      <CalendarHeader
        authSession={authSession}
        onLogout={onLogout}
      />

      <main>
        <section className="calendar-hero">
          <h1>채용 일정 캘린더</h1>
          <p>
            관심 있는 개발자 채용공고의 마감일을
            한눈에 확인해보세요.
          </p>
        </section>

        <CalendarControls
          view={view}
          filters={filters}
          isLoading={isLoading}
          onViewChange={changeView}
          onFilterChange={changeFilter}
          onFilterReset={resetFilters}
          onSkillSearchOpen={() =>
            setIsSkillSearchOpen(true)
          }
        />

        <div className="calendar-layout">
          <MonthCalendar
            visibleMonth={visibleMonth}
            selectedDate={selectedDate}
            events={events}
            isLoading={isLoading}
            onDateSelect={setSelectedDate}
            onMonthMove={moveMonth}
            onToday={goToToday}
          />

          <SelectedDatePanel
            selectedDate={selectedDate}
            events={events}
            view={view}
            summary={summary}
            isLoading={isLoading}
            errorMessage={errorMessage}
            requiresLogin={requiresLogin}
            onRetry={retry}
          />
        </div>
      </main>

      <JobSkillSearchModal
        isOpen={isSkillSearchOpen}
        selectedSkillNames={filters.skillNames}
        onApply={(skillNames) =>
          changeFilter("skillNames", skillNames)
        }
        onClose={() =>
          setIsSkillSearchOpen(false)
        }
      />
    </div>
  );
}
