import { Link } from "react-router-dom";

function formatAnalyzedAt(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function AnalysisSection({ title, items, ordered = false }) {
  const List = ordered ? "ol" : "ul";
  const displayItems = (items ?? []).filter(
    (item) => typeof item === "string" && item.trim(),
  );

  return (
    <div className="job-ai-section">
      <h3>{title}</h3>
      {displayItems.length > 0 ? (
        <List
          className={
            ordered ? "job-ai-tasks" : "job-ai-chips"
          }
        >
          {displayItems.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </List>
      ) : (
        <p className="job-ai-empty">분석된 내용이 없습니다.</p>
      )}
    </div>
  );
}

export function JobAiPanel({
  analysis,
  analysisError,
  isAnalysisLoading,
  onAnalysisRetry,
  authSession,
  resumes,
  selectedResumeId,
  onResumeChange,
  isResumesLoading,
  resumeError,
  isRecommendationPending,
  onRecommendationCreate,
}) {
  const aiAnalysis = analysis?.aiAnalysis;

  return (
    <aside className="job-ai-panel" aria-labelledby="job-ai-title">
      <div className="job-ai-panel__heading">
        <div>
          <span className="job-ai-panel__badge">AI</span>
          <h2 id="job-ai-title">공고 핵심 분석</h2>
        </div>
        {analysis && (
          <span className="job-ai-panel__cache">
            {analysis.cached ? "저장된 분석" : "분석 완료"}
          </span>
        )}
      </div>

      {isAnalysisLoading ? (
        <div className="job-ai-loading" role="status">
          <span />
          공고 내용을 분석하고 있어요.
        </div>
      ) : analysisError ? (
        <div className="job-ai-error" role="alert">
          <p>{analysisError}</p>
          <button type="button" onClick={() => onAnalysisRetry()}>
            다시 분석하기
          </button>
        </div>
      ) : aiAnalysis ? (
        <>
          <AnalysisSection
            title="주요 업무"
            items={aiAnalysis.taskSummary}
            ordered
          />
          <AnalysisSection
            title="필수 역량"
            items={aiAnalysis.requiredSkills}
          />
          <AnalysisSection
            title="예상 수행 업무"
            items={aiAnalysis.possibleTasks}
          />
          {aiAnalysis.analyzedAt && (
            <p className="job-ai-panel__time">
              {formatAnalyzedAt(aiAnalysis.analyzedAt)} 기준
            </p>
          )}
        </>
      ) : null}

      <div className="resume-comparison">
        <div className="resume-comparison__heading">
          <div>
            <span>AI 이력서 피드백</span>
            <h3>내 이력서와 공고를 비교해보세요</h3>
          </div>
          <span aria-hidden="true">✦</span>
        </div>

        {!authSession ? (
          <div className="resume-comparison__notice">
            <p>로그인하면 저장된 이력서를 선택해 비교할 수 있어요.</p>
            <Link to="/auth">로그인하고 분석하기</Link>
          </div>
        ) : isResumesLoading ? (
          <p className="resume-comparison__status" role="status">
            이력서를 불러오는 중이에요.
          </p>
        ) : resumes.length === 0 ? (
          <div className="resume-comparison__notice">
            <p>비교할 이력서가 아직 없습니다.</p>
            <Link to="/resume/new">이력서 만들기</Link>
          </div>
        ) : (
          <>
            <label htmlFor="job-detail-resume-select">
              비교할 이력서 선택
            </label>
            <div className="resume-comparison__select-wrap">
              <select
                id="job-detail-resume-select"
                value={selectedResumeId}
                onChange={(event) =>
                  onResumeChange(event.target.value)
                }
              >
                {resumes.map((resume) => (
                  <option
                    key={resume.resumeId}
                    value={String(resume.resumeId)}
                  >
                    {resume.title}
                    {resume.isDefault ? " · 기본 이력서" : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="resume-comparison__button"
              type="button"
              disabled={
                !selectedResumeId || isRecommendationPending
              }
              onClick={onRecommendationCreate}
            >
              {isRecommendationPending
                ? "AI가 비교·분석하고 있어요..."
                : "이력서와 비교·분석하기"}
            </button>
          </>
        )}

        {resumeError && (
          <p className="resume-comparison__error" role="alert">
            {resumeError}
          </p>
        )}
        <p className="resume-comparison__help">
          버튼을 누를 때만 AI 피드백 분석이 시작됩니다.
        </p>
      </div>
    </aside>
  );
}
