import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  DEFAULT_JOB_NOTICE_FILTERS,
  DEFAULT_JOB_NOTICE_PAGE,
  DEFAULT_JOB_NOTICE_PAGE_SIZE,
} from "../api/jobNotices/jobNotices.constants";
import {
  JobFilterPanel,
} from "../components/jobNotices/JobFilterPanel";
import {
  JobNoticeList,
} from "../components/jobNotices/JobNoticeList";
import {
  JobPagination,
} from "../components/jobNotices/JobPagination";
import {
  JobResultsHeader,
} from "../components/jobNotices/JobResultsHeader";
import {
  JobSearchBar,
} from "../components/jobNotices/JobSearchBar";
import {
  JobSkillSearchModal,
} from "../components/jobNotices/JobSkillSearchModal";
import {
  useJobNotices,
} from "../hooks/jobNotices/useJobNotices";
import "../styles/job-notices.css";

function createInitialFilters() {
  return {
    ...DEFAULT_JOB_NOTICE_FILTERS,
    skillNames: [
      ...DEFAULT_JOB_NOTICE_FILTERS.skillNames,
    ],
  };
}

export function JobNoticesPage({
  authSession = null,
  onLogout = () => {},
}) {
  const navigate = useNavigate();
  const [draftFilters, setDraftFilters] =
    useState(createInitialFilters);
  const [appliedFilters, setAppliedFilters] =
    useState(createInitialFilters);
  const [page, setPage] = useState(
    DEFAULT_JOB_NOTICE_PAGE,
  );
  const [isSkillSearchOpen, setIsSkillSearchOpen] =
    useState(false);

  const {
    jobNotices,
    currentPage,
    pageSize,
    totalElements,
    isLoading,
    errorMessage,
    pendingBookmarkIds,
    retry,
    toggleBookmark,
  } = useJobNotices({
    filters: appliedFilters,
    page,
    size: DEFAULT_JOB_NOTICE_PAGE_SIZE,
    accessToken: authSession?.accessToken,
  });

  async function handleBookmarkToggle(jobNotice) {
    if (!authSession?.accessToken) {
      navigate("/auth");
      return;
    }

    try {
      await toggleBookmark(jobNotice);
    } catch (error) {
      if (error?.status === 401) {
        navigate("/auth");
        return;
      }

      window.alert(
        error instanceof Error
          ? error.message
          : "북마크 처리에 실패했습니다.",
      );
    }
  }

  function handleFilterChange(name, value) {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function handleFiltersApply() {
    setAppliedFilters({
      ...draftFilters,
      skillNames: [...draftFilters.skillNames],
    });
    setPage(DEFAULT_JOB_NOTICE_PAGE);
  }

  function handleFiltersReset() {
    const initialFilters = createInitialFilters();

    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(DEFAULT_JOB_NOTICE_PAGE);
  }

  function handleSortChange(sort) {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      sort,
    }));
    setAppliedFilters((currentFilters) => ({
      ...currentFilters,
      sort,
    }));
    setPage(DEFAULT_JOB_NOTICE_PAGE);
  }

  function handlePageChange(nextPage) {
    setPage(nextPage);

    window.requestAnimationFrame(() => {
      document
        .querySelector(".job-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  }

  function handleSkillApply(skillNames) {
    handleFilterChange("skillNames", skillNames);
  }

  return (
    <div className="job-notices-page">
      <header className="job-notices-header">
        <Link
          className="job-notices-header__brand"
          to="/"
        >
          dejavu
        </Link>

        <nav aria-label="주요 메뉴">
          <Link to="/jobs" aria-current="page">
            채용공고
          </Link>
          <Link to="/calendar">캘린더</Link>
          <Link to="/resume">이력서</Link>
          {authSession ? (
            <>
              <span className="job-notices-header__user">
                {authSession.user.email}
              </span>
              <Link
                className="job-notices-header__mypage"
                to="/mypage"
              >
                마이페이지
              </Link>
              <button
                className="job-notices-header__login"
                type="button"
                onClick={onLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              className="job-notices-header__login"
              to="/auth"
            >
              로그인
            </Link>
          )}
        </nav>
      </header>

      <main>
        <section className="job-notices-hero">
          <h1>채용공고 탐색</h1>

          <p>
            직무와 기술 스택을 선택해 원하는
            채용공고를 찾아보세요.
          </p>

          <JobSearchBar
            value={draftFilters.keyword}
            isLoading={isLoading}
            onChange={(keyword) =>
              handleFilterChange(
                "keyword",
                keyword,
              )
            }
            onSubmit={handleFiltersApply}
          />
        </section>

        <div className="job-notices-layout">
          <JobFilterPanel
            filters={draftFilters}
            isLoading={isLoading}
            onChange={handleFilterChange}
            onReset={handleFiltersReset}
            onApply={handleFiltersApply}
            onOpenSkillSearch={() =>
              setIsSkillSearchOpen(true)
            }
          />

          <section className="job-results">
            <JobResultsHeader
              totalElements={totalElements}
              sort={appliedFilters.sort}
              isLoading={isLoading}
              onSortChange={handleSortChange}
            />

            <JobNoticeList
              jobNotices={jobNotices}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onRetry={retry}
              onBookmarkToggle={handleBookmarkToggle}
              pendingBookmarkIds={
                pendingBookmarkIds
              }
            />

            <JobPagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalElements={totalElements}
              isLoading={isLoading}
              onPageChange={handlePageChange}
            />
          </section>
        </div>
      </main>

      <JobSkillSearchModal
        isOpen={isSkillSearchOpen}
        selectedSkillNames={
          draftFilters.skillNames
        }
        onApply={handleSkillApply}
        onClose={() =>
          setIsSkillSearchOpen(false)
        }
      />
    </div>
  );
}
