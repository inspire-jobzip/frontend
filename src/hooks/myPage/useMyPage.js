import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  myPageApi,
} from "../../api/myPage/myPage.api";

function getErrorMessage(error, fallback) {
  return error instanceof Error
    ? error.message
    : fallback;
}

export function useMyPage(accessToken) {
  const [myPageData, setMyPageData] =
    useState(null);
  const [isLoading, setIsLoading] =
    useState(Boolean(accessToken));
  const [isSavingProfile, setIsSavingProfile] =
    useState(false);
  const [pendingBookmarkIds, setPendingBookmarkIds] =
    useState([]);
  const [pendingResumeIds, setPendingResumeIds] =
    useState([]);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [isUnauthorized, setIsUnauthorized] =
    useState(false);
  const [reloadCount, setReloadCount] =
    useState(0);
  const abortControllerRef = useRef(null);

  const loadMyPage = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    abortControllerRef.current?.abort();
    const abortController =
      new AbortController();
    abortControllerRef.current =
      abortController;

    setIsLoading(true);
    setErrorMessage("");
    setIsUnauthorized(false);

    try {
      const data = await myPageApi.getMyPage({
        accessToken,
        signal: abortController.signal,
      });

      setMyPageData(data);
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      if (error?.status === 401) {
        setIsUnauthorized(true);
      }

      setErrorMessage(
        getErrorMessage(
          error,
          "마이페이지 정보를 불러오지 못했습니다.",
        ),
      );
    } finally {
      if (
        abortControllerRef.current ===
        abortController
      ) {
        setIsLoading(false);
      }
    }
  }, [accessToken]);

  useEffect(() => {
    loadMyPage();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [loadMyPage, reloadCount]);

  const retry = useCallback(() => {
    setReloadCount((count) => count + 1);
  }, []);

  const saveProfile = useCallback(
    async (profileRequest) => {
      setIsSavingProfile(true);

      try {
        const updatedProfile =
          await myPageApi.updateProfile({
            accessToken,
            profile: profileRequest,
          });

        setMyPageData((currentData) => ({
          ...currentData,
          profile: {
            ...currentData.profile,
            ...updatedProfile,
          },
        }));

        return updatedProfile;
      } catch (error) {
        if (error?.status === 401) {
          setIsUnauthorized(true);
        }

        throw error;
      } finally {
        setIsSavingProfile(false);
      }
    },
    [accessToken],
  );

  const removeBookmark = useCallback(
    async (jobNoticeId) => {
      setPendingBookmarkIds((currentIds) => [
        ...currentIds,
        jobNoticeId,
      ]);

      try {
        await myPageApi.deleteBookmark({
          accessToken,
          jobNoticeId,
        });

        setMyPageData((currentData) => ({
          ...currentData,
          bookmarks:
            currentData.bookmarks.filter(
              (bookmark) =>
                bookmark.jobNoticeId !==
                jobNoticeId,
            ),
        }));
      } catch (error) {
        if (error?.status === 401) {
          setIsUnauthorized(true);
        }

        throw error;
      } finally {
        setPendingBookmarkIds((currentIds) =>
          currentIds.filter(
            (id) => id !== jobNoticeId,
          ),
        );
      }
    },
    [accessToken],
  );

  const removeResume = useCallback(
    async (resumeId) => {
      setPendingResumeIds((currentIds) => [
        ...currentIds,
        resumeId,
      ]);

      try {
        await myPageApi.deleteResume({
          accessToken,
          resumeId,
        });

        setMyPageData((currentData) => ({
          ...currentData,
          resumes: currentData.resumes.filter(
            (resume) =>
              resume.resumeId !== resumeId,
          ),
        }));
      } catch (error) {
        if (error?.status === 401) {
          setIsUnauthorized(true);
        }

        throw error;
      } finally {
        setPendingResumeIds((currentIds) =>
          currentIds.filter(
            (id) => id !== resumeId,
          ),
        );
      }
    },
    [accessToken],
  );

  return {
    myPageData,
    isLoading,
    isSavingProfile,
    pendingBookmarkIds,
    pendingResumeIds,
    errorMessage,
    isUnauthorized,
    retry,
    saveProfile,
    removeBookmark,
    removeResume,
  };
}
