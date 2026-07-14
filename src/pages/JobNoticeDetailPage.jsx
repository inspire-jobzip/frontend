import { Link, useNavigate, useParams } from "react-router-dom";

import { JobAiPanel } from "../components/jobDetail/JobAiPanel";
import { JobDescriptionCard } from "../components/jobDetail/JobDescriptionCard";
import { JobDetailHeader } from "../components/jobDetail/JobDetailHeader";
import { JobInformationCard } from "../components/jobDetail/JobInformationCard";
import { JobSummaryCard } from "../components/jobDetail/JobSummaryCard";
import { ResumeFeedbackModal } from "../components/jobDetail/ResumeFeedbackModal";
import { useJobNoticeDetail } from "../hooks/jobDetail/useJobNoticeDetail";
import "../styles/job-detail.css";

export function JobNoticeDetailPage({
  authSession = null,
  onLogout = () => {},
}) {
  const { jobNoticeId: jobNoticeIdParam } = useParams();
  const navigate = useNavigate();
  const jobNoticeId = Number(jobNoticeIdParam);
  const isValidJobNoticeId =
    Number.isInteger(jobNoticeId) && jobNoticeId > 0;

  const detail = useJobNoticeDetail({
    jobNoticeId,
    accessToken: authSession?.accessToken,
  });

  const selectedResume = detail.resumes.find(
    (resume) =>
      String(resume.resumeId) === detail.selectedResumeId,
  );

  async function handleBookmarkToggle() {
    if (!authSession?.accessToken) {
      navigate("/auth");
      return;
    }

    try {
      await detail.toggleBookmark();
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

  async function handleRecommendationCreate() {
    try {
      await detail.createRecommendation();
    } catch (error) {
      if (error?.status === 401) {
        navigate("/auth");
      }
    }
  }

  if (!isValidJobNoticeId) {
    return (
      <div className="job-detail-page">
        <JobDetailHeader
          authSession={authSession}
          onLogout={onLogout}
        />
        <main className="job-detail-state">
          <h1>올바르지 않은 채용공고 주소입니다.</h1>
          <Link to="/jobs">채용공고 목록으로</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="job-detail-page">
      <JobDetailHeader
        authSession={authSession}
        onLogout={onLogout}
      />

      <main className="job-detail-main">
        <nav className="job-detail-breadcrumb" aria-label="현재 위치">
          <Link to="/jobs">채용공고</Link>
          <span aria-hidden="true">/</span>
          <span>공고 상세</span>
        </nav>

        {detail.isDetailLoading ? (
          <div className="job-detail-state" role="status">
            <span className="job-detail-spinner" />
            <p>채용공고를 불러오는 중이에요.</p>
          </div>
        ) : detail.detailError || !detail.jobNotice ? (
          <div className="job-detail-state" role="alert">
            <h1>채용공고를 불러오지 못했습니다.</h1>
            <p>{detail.detailError}</p>
            <Link to="/jobs">채용공고 목록으로</Link>
          </div>
        ) : (
          <>
            <JobSummaryCard
              jobNotice={detail.jobNotice}
              isBookmarkPending={detail.isBookmarkPending}
              onBookmarkToggle={handleBookmarkToggle}
            />

            <div className="job-detail-layout">
              <div className="job-detail-content">
                <JobInformationCard jobNotice={detail.jobNotice} />
                <JobDescriptionCard jobNotice={detail.jobNotice} />
              </div>

              <JobAiPanel
                analysis={detail.analysis}
                analysisError={detail.analysisError}
                isAnalysisLoading={detail.isAnalysisLoading}
                onAnalysisRetry={detail.loadAnalysis}
                authSession={authSession}
                resumes={detail.resumes}
                selectedResumeId={detail.selectedResumeId}
                onResumeChange={detail.setSelectedResumeId}
                isResumesLoading={detail.isResumesLoading}
                resumeError={detail.resumeError}
                isRecommendationPending={
                  detail.isRecommendationPending
                }
                onRecommendationCreate={
                  handleRecommendationCreate
                }
              />
            </div>
          </>
        )}
      </main>

      <ResumeFeedbackModal
        recommendation={detail.recommendation}
        resumeTitle={selectedResume?.title}
        jobTitle={detail.jobNotice?.title ?? "채용공고"}
        onClose={() => detail.setRecommendation(null)}
      />
    </div>
  );
}
