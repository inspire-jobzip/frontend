import {
  JobNoticeCard,
} from "./JobNoticeCard";

const SKELETON_CARD_COUNT = 6;

export function JobNoticeList({
  jobNotices,
  isLoading,
  errorMessage,
  onRetry,
  onBookmarkToggle,
  pendingBookmarkIds = [],
}) {
  if (isLoading) {
    return (
      <div
        className="job-notice-list job-notice-list--loading"
        aria-busy="true"
        aria-label="채용공고 불러오는 중"
      >
        {Array.from(
          { length: SKELETON_CARD_COUNT },
          (_, index) => (
            <div
              className="job-notice-card-skeleton"
              key={index}
              aria-hidden="true"
            >
              <span />
              <strong />
              <span />
              <span />
              <div />
            </div>
          ),
        )}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div
        className="job-notice-list-state"
        role="alert"
      >
        <strong>
          채용공고를 불러오지 못했습니다.
        </strong>

        <p>{errorMessage}</p>

        <button type="button" onClick={onRetry}>
          다시 시도
        </button>
      </div>
    );
  }

  if (jobNotices.length === 0) {
    return (
      <div className="job-notice-list-state">
        <strong>
          조건에 맞는 채용공고가 없습니다.
        </strong>

        <p>
          검색어나 필터 조건을 변경해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="job-notice-list">
      {jobNotices.map((jobNotice) => (
        <JobNoticeCard
          key={jobNotice.jobNoticeId}
          jobNotice={jobNotice}
          onBookmarkToggle={onBookmarkToggle}
          isBookmarkPending={pendingBookmarkIds.includes(
            jobNotice.jobNoticeId,
          )}
        />
      ))}
    </div>
  );
}