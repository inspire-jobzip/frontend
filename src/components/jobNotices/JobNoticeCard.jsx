import { Link } from "react-router-dom";

import {
  JOB_NOTICE_JOB_ROLE_LABELS,
} from "../../api/jobNotices/jobNotices.constants";

const CARD_EXPERIENCE_LABELS = {
  ANY: "경력 무관",
  NEW: "신입",
  EXPERIENCED: "경력",
};

const MILLISECONDS_PER_DAY =
  24 * 60 * 60 * 1000;
const MAX_VISIBLE_SKILLS = 3;

function getStartOfDay(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
}

export function getDeadlineDisplay(
  deadlineAt,
  now = new Date(),
) {
  if (!deadlineAt) {
    return {
      label: "상시채용",
      status: "open",
    };
  }

  const deadline = new Date(deadlineAt);

  if (Number.isNaN(deadline.getTime())) {
    return {
      label: "마감일 미정",
      status: "open",
    };
  }

  const daysRemaining = Math.ceil(
    (getStartOfDay(deadline) -
      getStartOfDay(now)) /
      MILLISECONDS_PER_DAY,
  );

  if (daysRemaining < 0) {
    return {
      label: "마감",
      status: "closed",
    };
  }

  if (daysRemaining === 0) {
    return {
      label: "오늘 마감",
      status: "urgent",
    };
  }

  return {
    label: `D-${daysRemaining}`,
    status:
      daysRemaining <= 7
        ? "urgent"
        : "open",
  };
}

export function JobNoticeCard({
  jobNotice,
  onBookmarkToggle = () => {},
  isBookmarkPending = false,
}) {
  const {
    jobNoticeId,
    companyName,
    title,
    jobCategory,
    locationText,
    experienceLevel,
    employmentType,
    deadlineAt,
    skillNames,
    isBookmarked,
  } = jobNotice;

  const roleLabel =
    JOB_NOTICE_JOB_ROLE_LABELS[
      jobCategory
    ] ?? jobCategory;
  const experienceLabel =
    CARD_EXPERIENCE_LABELS[
      experienceLevel
    ] ?? experienceLevel;
  const jobMeta = [
    roleLabel,
    experienceLabel,
    employmentType,
  ].filter(Boolean);
  const displayedSkills = skillNames.slice(
    0,
    MAX_VISIBLE_SKILLS,
  );
  const hiddenSkillCount = Math.max(
    skillNames.length - MAX_VISIBLE_SKILLS,
    0,
  );
  const deadlineDisplay =
    getDeadlineDisplay(deadlineAt);

  return (
    <article className="job-notice-card">
      <Link
        className="job-notice-card__link"
        to={`/jobs/${jobNoticeId}`}
        aria-label={`${companyName} ${title} 상세 보기`}
      >
        <p className="job-notice-card__company">
          {companyName}
        </p>

        <h3>{title}</h3>

        <p className="job-notice-card__meta">
          {jobMeta.join(" · ")}
        </p>

        <div className="job-notice-card__location-row">
          <span>
            {locationText ?? "근무지 정보 없음"}
          </span>

          <strong
            className={`job-notice-card__deadline job-notice-card__deadline--${deadlineDisplay.status}`}
          >
            {deadlineDisplay.label}
          </strong>
        </div>

        {skillNames.length > 0 ? (
          <ul className="job-notice-card__skills">
            {displayedSkills.map((skillName) => (
              <li key={skillName}>{skillName}</li>
            ))}

            {hiddenSkillCount > 0 && (
              <li className="job-notice-card__more-skills">
                +{hiddenSkillCount}
              </li>
            )}
          </ul>
        ) : (
          <p className="job-notice-card__no-skills">
            기술 스택 정보 없음
          </p>
        )}
      </Link>

      <button
        className="job-notice-card__bookmark"
        type="button"
        aria-label={
          isBookmarked
            ? "북마크 취소"
            : "북마크 추가"
        }
        aria-pressed={isBookmarked}
        disabled={isBookmarkPending}
        onClick={() =>
          onBookmarkToggle(jobNotice)
        }
      >
        <span aria-hidden="true">
          {isBookmarked ? "♥" : "♡"}
        </span>
      </button>
    </article>
  );
}