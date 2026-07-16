import { Link } from "react-router-dom";

function getDeadlineLabel(bookmark) {
  if (
    typeof bookmark.daysUntilDeadline ===
    "number"
  ) {
    if (bookmark.daysUntilDeadline < 0) {
      return "마감";
    }

    if (bookmark.daysUntilDeadline === 0) {
      return "오늘 마감";
    }

    return `D-${bookmark.daysUntilDeadline}`;
  }

  if (!bookmark.deadlineAt) {
    return "상시채용";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(bookmark.deadlineAt));
}

function isClosedBookmark(bookmark) {
  return (
    bookmark.recruitStatus === "CLOSED" ||
    bookmark.daysUntilDeadline < 0
  );
}

export function BookmarkListCard({
  bookmarks,
  pendingBookmarkIds,
  onRemove,
}) {
  return (
    <section className="my-page-card bookmark-list-card">
      <header className="my-page-card__heading">
        <h2>스크랩 공고</h2>
        <span>{bookmarks.length}개</span>
      </header>

      {bookmarks.length > 0 ? (
        <div className="bookmark-list-card__scroll">
          <ul className="bookmark-list-card__list">
            {bookmarks.map((bookmark) => {
              const isClosed =
                isClosedBookmark(bookmark);
              const isPending =
                pendingBookmarkIds.includes(
                  bookmark.jobNoticeId,
                );

              return (
                <li
                  className={
                    isClosed
                      ? "bookmark-item bookmark-item--closed"
                      : "bookmark-item"
                  }
                  key={bookmark.bookmarkId}
                >
                  <Link
                    to={`/jobs/${bookmark.jobNoticeId}`}
                  >
                    <strong>
                      {bookmark.companyName} ·{" "}
                      {bookmark.title}
                    </strong>

                    <span className="bookmark-item__meta">
                      <em>
                        {bookmark.recruitStatusText}
                      </em>
                      <b>
                        {getDeadlineLabel(bookmark)}
                      </b>
                    </span>
                  </Link>

                  <button
                    type="button"
                    aria-label={`${bookmark.title} 스크랩 해제`}
                    disabled={isPending}
                    onClick={() =>
                      onRemove(
                        bookmark.jobNoticeId,
                      )
                    }
                  >
                    <span aria-hidden="true">♥</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="my-page-empty-state">
          <strong>
            아직 스크랩한 공고가 없습니다.
          </strong>
          <p>
            관심 있는 공고를 저장하고 여기에서
            관리해보세요.
          </p>
          <Link to="/jobs">
            채용공고 둘러보기
          </Link>
        </div>
      )}
    </section>
  );
}
