import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  jobDetailApi,
} from "../../api/jobDetail/jobDetail.api";
import {
  jobNoticesApi,
} from "../../api/jobNotices/jobNotices.api";
import {
  resumeApi,
} from "../../api/resume/resume.api";

function getErrorMessage(error, fallback) {
  return error instanceof Error
    ? error.message
    : fallback;
}

export function useJobNoticeDetail({
  jobNoticeId,
  accessToken,
}) {
  const [jobNotice, setJobNotice] =
    useState(null);
  const [analysis, setAnalysis] =
    useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] =
    useState("");
  const [recommendation, setRecommendation] =
    useState(null);
  const [isDetailLoading, setIsDetailLoading] =
    useState(true);
  const [isAnalysisLoading, setIsAnalysisLoading] =
    useState(true);
  const [isResumesLoading, setIsResumesLoading] =
    useState(Boolean(accessToken));
  const [isBookmarkPending, setIsBookmarkPending] =
    useState(false);
  const [isRecommendationPending, setIsRecommendationPending] =
    useState(false);
  const [detailError, setDetailError] = useState("");
  const [analysisError, setAnalysisError] =
    useState("");
  const [resumeError, setResumeError] = useState("");
  const abortControllerRef = useRef(null);

  const loadAnalysis = useCallback(
    async ({ signal } = {}) => {
      setIsAnalysisLoading(true);
      setAnalysisError("");

      try {
        const response = await jobDetailApi.analyzeJob({
          jobNoticeId,
          signal,
        });
        setAnalysis(response);
        return response;
      } catch (error) {
        if (error?.name === "AbortError") {
          return null;
        }
        setAnalysisError(
          getErrorMessage(
            error,
            "공고 AI 분석을 불러오지 못했습니다.",
          ),
        );
        return null;
      } finally {
        setIsAnalysisLoading(false);
      }
    },
    [jobNoticeId],
  );

  useEffect(() => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setJobNotice(null);
    setAnalysis(null);
    setRecommendation(null);
    setDetailError("");
    setResumeError("");
    setIsDetailLoading(true);
    setIsAnalysisLoading(true);

    async function loadDetail() {
      try {
        const response = await jobDetailApi.getJobDetail({
          jobNoticeId,
          signal: abortController.signal,
        });
        setJobNotice(response);
      } catch (error) {
        if (error?.name !== "AbortError") {
          setDetailError(
            getErrorMessage(
              error,
              "채용공고 상세 정보를 불러오지 못했습니다.",
            ),
          );
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsDetailLoading(false);
        }
      }
    }

    async function loadResumes() {
      if (!accessToken) {
        setResumes([]);
        setSelectedResumeId("");
        setIsResumesLoading(false);
        return;
      }

      setIsResumesLoading(true);
      try {
        const response = await resumeApi.getResumes({
          accessToken,
          signal: abortController.signal,
        });
        setResumes(response);
        const defaultResume =
          response.find((resume) => resume.isDefault) ??
          response[0];
        setSelectedResumeId(
          defaultResume
            ? String(defaultResume.resumeId)
            : "",
        );
      } catch (error) {
        if (error?.name !== "AbortError") {
          setResumeError(
            getErrorMessage(
              error,
              "이력서 목록을 불러오지 못했습니다.",
            ),
          );
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsResumesLoading(false);
        }
      }
    }

    loadDetail();
    loadAnalysis({ signal: abortController.signal });
    loadResumes();

    return () => abortController.abort();
  }, [accessToken, jobNoticeId, loadAnalysis]);

  const toggleBookmark = useCallback(async () => {
    if (!jobNotice || !accessToken) {
      return null;
    }

    setIsBookmarkPending(true);
    try {
      const bookmark = jobNotice.isBookmarked
        ? await jobNoticesApi.deleteBookmark({
            jobNoticeId,
            accessToken,
          })
        : await jobNoticesApi.createBookmark({
            jobNoticeId,
            accessToken,
          });

      setJobNotice((current) => ({
        ...current,
        isBookmarked: bookmark.isBookmarked,
      }));
      return bookmark;
    } finally {
      setIsBookmarkPending(false);
    }
  }, [accessToken, jobNotice, jobNoticeId]);

  const createRecommendation = useCallback(async () => {
    if (!accessToken || !selectedResumeId) {
      return null;
    }

    setIsRecommendationPending(true);
    setResumeError("");
    try {
      const response =
        await jobDetailApi.createRecommendation({
          accessToken,
          jobNoticeId,
          resumeId: Number(selectedResumeId),
        });
      setRecommendation(response);
      return response;
    } catch (error) {
      setResumeError(
        getErrorMessage(
          error,
          "이력서 비교 분석에 실패했습니다.",
        ),
      );
      throw error;
    } finally {
      setIsRecommendationPending(false);
    }
  }, [accessToken, jobNoticeId, selectedResumeId]);

  return {
    jobNotice,
    analysis,
    resumes,
    selectedResumeId,
    recommendation,
    isDetailLoading,
    isAnalysisLoading,
    isResumesLoading,
    isBookmarkPending,
    isRecommendationPending,
    detailError,
    analysisError,
    resumeError,
    setSelectedResumeId,
    setRecommendation,
    toggleBookmark,
    loadAnalysis,
    createRecommendation,
  };
}
