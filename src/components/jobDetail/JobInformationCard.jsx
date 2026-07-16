import {
  JOB_DETAIL_LABELS,
} from "../../api/jobDetail/jobDetail.constants";

function valueOrFallback(value) {
  return value || "정보 없음";
}

export function JobInformationCard({ jobNotice }) {
  const items = [
    [
      "직무",
      JOB_DETAIL_LABELS.jobCategory[
        jobNotice.jobCategory
      ] ?? valueOrFallback(jobNotice.jobCategory),
    ],
    [
      "경력 조건",
      JOB_DETAIL_LABELS.experienceLevel[
        jobNotice.experienceLevel
      ] ?? valueOrFallback(jobNotice.experienceLevel),
    ],
    ["고용 형태", valueOrFallback(jobNotice.employmentType)],
    ["근무지", valueOrFallback(jobNotice.locationText)],
    ["학력 조건", valueOrFallback(jobNotice.educationLevel)],
    ["급여", valueOrFallback(jobNotice.salaryText)],
  ];

  return (
    <section className="job-detail-card">
      <h2>공고 정보</h2>
      <dl className="job-detail-info-grid">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="job-detail-keywords">
        <span>직무·기술 키워드</span>
        <strong>
          {jobNotice.roleKeywordsText ||
            jobNotice.skillNames.join(" · ") ||
            "정보 없음"}
        </strong>
      </div>
    </section>
  );
}
