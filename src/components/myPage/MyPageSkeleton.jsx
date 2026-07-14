export function MyPageSkeleton() {
  return (
    <div
      className="my-page-layout my-page-skeleton"
      aria-label="마이페이지를 불러오는 중"
      aria-busy="true"
    >
      {["프로필", "스크랩 공고", "이력서"].map(
        (label) => (
          <section
            className="my-page-card"
            key={label}
          >
            <span className="my-page-skeleton__title" />
            <span className="my-page-skeleton__block" />
            <span className="my-page-skeleton__block" />
            <span className="my-page-skeleton__block" />
          </section>
        ),
      )}
    </div>
  );
}
