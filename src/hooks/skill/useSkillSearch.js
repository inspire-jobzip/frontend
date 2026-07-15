import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  skillApi,
} from "../../api/skill/skill.api";

export function useSkillSearch(accessToken) {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const abortControllerRef = useRef(null);

  const loadSkills = useCallback(
    async ({ keyword = "", category = "" } = {}) => {

      // 늦게 도착한 이전 응답이 최신 검색 결과를 덮지 않도록 취소한다.
      abortControllerRef.current?.abort();

      const abortController =
        new AbortController();

      abortControllerRef.current =
        abortController;

      setIsLoading(true);
      setErrorMessage("");

      try {
        const searchResults =
          await skillApi.searchSkills({
            keyword,
            category,
            accessToken,
            signal: abortController.signal,
          });

        setSkills(searchResults);

        return searchResults;
      } catch (error) {
        if (error?.name === "AbortError") {
          return [];
        }

        const message =
          error instanceof Error
            ? error.message
            : "기술 검색 중 오류가 발생했습니다.";

        setSkills([]);
        setErrorMessage(message);

        return [];
      } finally {
        // 현재 요청일 때만 로딩을 해제해 취소된 요청과의 상태 경쟁을 막는다.
        if (
          abortControllerRef.current ===
          abortController
        ) {
          setIsLoading(false);
        }
      }
    },
    [accessToken],
  );

  const searchSkills = useCallback(
    (keyword, category = "") =>
      loadSkills({ keyword: keyword.trim(), category }),
    [loadSkills],
  );

  const clearSearchResults = useCallback(() => {
    abortControllerRef.current?.abort();

    setSkills([]);
    setErrorMessage("");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // 언마운트 이후 비동기 응답이 상태를 갱신하지 않도록 요청을 정리한다.
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    skills,
    isLoading,
    errorMessage,
    loadSkills,
    searchSkills,
    clearSearchResults,
  };
}
