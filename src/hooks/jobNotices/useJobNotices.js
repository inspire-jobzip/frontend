import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  DEFAULT_JOB_NOTICE_FILTERS,
  DEFAULT_JOB_NOTICE_PAGE,
  DEFAULT_JOB_NOTICE_PAGE_SIZE,
} from "../../api/jobNotices/jobNotices.constants";
import {
  jobNoticesApi,
} from "../../api/jobNotices/jobNotices.api";

const EMPTY_JOB_NOTICE_PAGE = {
  content: [],
  page: DEFAULT_JOB_NOTICE_PAGE,
  size: DEFAULT_JOB_NOTICE_PAGE_SIZE,
  totalElements: 0,
};

export function useJobNotices({
  filters = DEFAULT_JOB_NOTICE_FILTERS,
  page = DEFAULT_JOB_NOTICE_PAGE,
  size = DEFAULT_JOB_NOTICE_PAGE_SIZE,
  accessToken,
} = {}) {
  const [jobNoticePage, setJobNoticePage] =
    useState(EMPTY_JOB_NOTICE_PAGE);
  const [isLoading, setIsLoading] =
    useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [reloadCount, setReloadCount] =
    useState(0);
  const [pendingBookmarkIds, setPendingBookmarkIds] =
    useState([]);

  const abortControllerRef = useRef(null);
  const skillNamesKey = Array.isArray(
    filters.skillNames,
  )
    ? filters.skillNames.join("\u0000")
    : "";

  const loadJobNotices = useCallback(async () => {
    abortControllerRef.current?.abort();

    const abortController =
      new AbortController();

    abortControllerRef.current =
      abortController;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response =
        await jobNoticesApi.getJobNotices({
          accessToken,
          filters: {
            keyword: filters.keyword,
            jobRole: filters.jobRole,
            skillNames: skillNamesKey
              ? skillNamesKey.split("\u0000")
              : [],
            experienceLevel:
              filters.experienceLevel,
            location: filters.location,
            sort: filters.sort,
          },
          page,
          size,
          signal: abortController.signal,
        });

      setJobNoticePage(response);
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "채용공고를 불러오지 못했습니다.";

      setErrorMessage(message);
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
    filters.keyword,
    filters.jobRole,
    filters.experienceLevel,
    filters.location,
    filters.sort,
    page,
    reloadCount,
    size,
    skillNamesKey,
  ]);

  useEffect(() => {
    loadJobNotices();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [loadJobNotices]);

  const retry = useCallback(() => {
    setReloadCount((currentCount) =>
      currentCount + 1,
    );
  }, []);

  const toggleBookmark = useCallback(
    async (jobNotice) => {
      const { jobNoticeId, isBookmarked } =
        jobNotice;

      const updateBookmarkState = (nextIsBookmarked) => {
        setJobNoticePage((currentPage) => ({
          ...currentPage,
          content: currentPage.content.map(
            (currentJobNotice) =>
              currentJobNotice.jobNoticeId === jobNoticeId
                ? {
                    ...currentJobNotice,
                    isBookmarked: nextIsBookmarked,
                  }
                : currentJobNotice,
          ),
        }));
      };

      setPendingBookmarkIds((currentIds) => [
        ...currentIds,
        jobNoticeId,
      ]);
      updateBookmarkState(!isBookmarked);

      try {
        const bookmark = isBookmarked
          ? await jobNoticesApi.deleteBookmark({
              jobNoticeId,
              accessToken,
            })
          : await jobNoticesApi.createBookmark({
              jobNoticeId,
              accessToken,
            });

        updateBookmarkState(bookmark.isBookmarked);

        return bookmark;
      } catch (error) {
        updateBookmarkState(isBookmarked);
        throw error;
      } finally {
        setPendingBookmarkIds((currentIds) =>
          currentIds.filter(
            (currentId) =>
              currentId !== jobNoticeId,
          ),
        );
      }
    },
    [accessToken],
  );

  return {
    jobNotices: jobNoticePage.content,
    currentPage: jobNoticePage.page,
    pageSize: jobNoticePage.size,
    totalElements: jobNoticePage.totalElements,
    isLoading,
    errorMessage,
    pendingBookmarkIds,
    retry,
    toggleBookmark,
  };
}
