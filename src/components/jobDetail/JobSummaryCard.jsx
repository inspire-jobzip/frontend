import {
  JOB_DETAIL_LABELS,
} from "../../api/jobDetail/jobDetail.constants";
import {
  getDeadlineDisplay,
} from "../jobNotices/JobNoticeCard";

function labelFor(group, value, fallback) {
  return (
    JOB_DETAIL_LABELS[group]?.[value] ??
    value ??
    fallback
  );
}

function getMatchPercent(score) {
  const normalized = Math.max(
    0,
    Math.min(1, Number(score) || 0),
  );
  return Math.round(normalized * 100);
}

export function JobSummaryCard({
  jobNotice,
  isBookmarkPending,
  onBookmarkToggle,
}) {
  const deadline = getDeadlineDisplay(
    jobNotice.deadlineAt,
  );
  const meta = [
    labelFor(
      "jobCategory",
      jobNotice.jobCategory,
      "직무 정보 없음",
    ),
    labelFor(
      "experienceLevel",
      jobNotice.experienceLevel,
      "경력 정보 없음",
    ),
    jobNotice.employmentType,
    jobNotice.locationText,
  ].filter(Boolean);

  return (
    <section className="job-detail-summary-card">
      <div className="job-detail-summary-card__top">
        <div>
          <p className="job-detail-summary-card__company">
            {jobNotice.companyName}
          </p>
          <h1>{jobNotice.title}</h1>
        </div>

        <div className="job-detail-summary-card__actions">
          <span className="job-detail-match">
            기술 스택 매칭
            <strong>
              {getMatchPercent(
                jobNotice.jaccardScore,
              )}
              %
            </strong>
          </span>
          <button
            className="job-detail-bookmark"
            type="button"
            aria-label={
              jobNotice.isBookmarked
                ? "북마크 취소"
                : "북마크 추가"
            }
            aria-pressed={jobNotice.isBookmarked}
            disabled={isBookmarkPending}
            onClick={onBookmarkToggle}
          >
            {jobNotice.isBookmarked ? "♥" : "♡"}
          </button>
        </div>
      </div>

      <ul className="job-detail-meta">
        {meta.map((item) => (
          <li key={item}>{item}</li>
        ))}
        <li
          className={`job-detail-meta__deadline job-detail-meta__deadline--${deadline.status}`}
        >
          {deadline.label}
        </li>
      </ul>

      <div className="job-detail-summary-card__bottom">
        <ul className="job-detail-skills">
          {jobNotice.skillNames.map((skillName) => (
            <li key={skillName}>{skillName}</li>
          ))}
        </ul>

        <div className="job-detail-summary-card__links">
          {jobNotice.sourceUrl && (
            <a
              className="job-detail-button job-detail-button--outline"
              href={jobNotice.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              원문 보기 ↗
            </a>
          )}
          {jobNotice.sourceUrl && (
            <a
              className="job-detail-button job-detail-button--primary"
              href={jobNotice.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              지원 페이지로 이동
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
