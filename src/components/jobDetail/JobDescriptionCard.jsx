export function JobDescriptionCard({ jobNotice }) {
  return (
    <section className="job-detail-card job-detail-description">
      <div className="job-detail-card__heading">
        <h2>공고 내용</h2>
        <span>채용공고 원문 기준</span>
      </div>
      <p>
        {jobNotice.descriptionRaw ||
          "공고 상세 내용이 제공되지 않았습니다."}
      </p>
    </section>
  );
}
