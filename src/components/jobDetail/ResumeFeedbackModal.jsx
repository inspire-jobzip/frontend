import { useEffect, useRef } from "react";

function formatCreatedAt(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(date);
}

export function ResumeFeedbackModal({
  recommendation,
  resumeTitle,
  jobTitle,
  onClose,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!recommendation) {
    return null;
  }

  return (
    <div
      className="resume-feedback-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="resume-feedback-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-feedback-title"
      >
        <header>
          <div>
            <span className="resume-feedback-modal__eyebrow">
              AI 이력서 피드백
            </span>
            <h2 id="resume-feedback-title">공고 맞춤 분석 결과</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="분석 결과 닫기"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="resume-feedback-modal__target">
          <span>{resumeTitle || "선택한 이력서"}</span>
          <strong>×</strong>
          <span>{jobTitle}</span>
        </div>

        <div className="resume-feedback-block">
          <h3>종합 피드백</h3>
          <p>{recommendation.feedbackText}</p>
        </div>

        <div className="resume-feedback-block">
          <h3>보완하면 좋은 키워드</h3>
          {recommendation.missingKeywords.length > 0 ? (
            <ul className="resume-feedback-keywords">
              {recommendation.missingKeywords.map((keyword) => (
                <li key={keyword}>{keyword}</li>
              ))}
            </ul>
          ) : (
            <p>현재 이력서에 필요한 주요 키워드가 잘 담겨 있어요.</p>
          )}
        </div>

        <div className="resume-feedback-project">
          <span>추천 프로젝트</span>
          <h3>{recommendation.recommendedProjectTitle}</h3>
          <p>{recommendation.recommendedProjectDescription}</p>
        </div>

        <footer>
          <span>
            {formatCreatedAt(recommendation.createdAt)} 분석
            {recommendation.modelName
              ? ` · ${recommendation.modelName}`
              : ""}
          </span>
          <button type="button" onClick={onClose}>
            확인
          </button>
        </footer>
      </section>
    </div>
  );
}
