import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  calendarApi,
} from "../../api/calendar/calendar.api";
import {
  CALENDAR_VIEWS,
  DEFAULT_CALENDAR_FILTERS,
} from "../../api/calendar/calendar.constants";

const EMPTY_SUMMARY = {
  openCount: 0,
  closingSoonCount: 0,
  closedCount: 0,
};

function getMonthStart(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
  );
}

export function useCalendar({ accessToken } = {}) {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] =
    useState(() => getMonthStart(today));
  const [selectedDate, setSelectedDate] =
    useState(today);
  const [view, setView] = useState(
    CALENDAR_VIEWS.ALL,
  );
  const [filters, setFilters] = useState(
    DEFAULT_CALENDAR_FILTERS,
  );
  const [events, setEvents] = useState([]);
  const [summary, setSummary] =
    useState(EMPTY_SUMMARY);
  const [isLoading, setIsLoading] =
    useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [reloadCount, setReloadCount] =
    useState(0);
  const abortControllerRef = useRef(null);

  const skillNamesKey =
    filters.skillNames.join("\u0000");
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth() + 1;
  const requiresLogin =
    view === CALENDAR_VIEWS.BOOKMARKS &&
    !accessToken;

  const loadCalendar = useCallback(async () => {
    abortControllerRef.current?.abort();

    if (requiresLogin) {
      setEvents([]);
      setSummary(EMPTY_SUMMARY);
      setErrorMessage("");
      setIsLoading(false);
      return;
    }

    const abortController =
      new AbortController();
    abortControllerRef.current = abortController;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response =
        view === CALENDAR_VIEWS.BOOKMARKS
          ? await calendarApi.getBookmarkCalendar({
              year,
              month,
              accessToken,
              signal: abortController.signal,
            })
          : await calendarApi.getJobNoticeCalendar({
              year,
              month,
              filters: {
                jobRole: filters.jobRole,
                skillNames: skillNamesKey
                  ? skillNamesKey.split("\u0000")
                  : [],
              },
              signal: abortController.signal,
            });

      setEvents(response.events);
      setSummary(
        response.summary ?? EMPTY_SUMMARY,
      );
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      setEvents([]);
      setSummary(EMPTY_SUMMARY);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "캘린더 일정을 불러오지 못했습니다.",
      );
    } finally {
      if (
        abortControllerRef.current ===
        abortController
      ) {
        setIsLoading(false);
      }
    }
  }, [
    accessToken,
    filters.jobRole,
    month,
    requiresLogin,
    skillNamesKey,
    view,
    year,
  ]);

  useEffect(() => {
    loadCalendar();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [loadCalendar, reloadCount]);

  const moveMonth = useCallback((amount) => {
    setVisibleMonth((currentMonth) =>
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + amount,
        1,
      ),
    );
    setSelectedDate((currentDate) =>
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + amount,
        1,
      ),
    );
  }, []);

  const goToToday = useCallback(() => {
    const currentToday = new Date();
    setVisibleMonth(getMonthStart(currentToday));
    setSelectedDate(currentToday);
  }, []);

  const changeView = useCallback((nextView) => {
    setView(nextView);
  }, []);

  const changeFilter = useCallback((name, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_CALENDAR_FILTERS);
  }, []);

  const retry = useCallback(() => {
    setReloadCount((count) => count + 1);
  }, []);

  return {
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
  };
}
