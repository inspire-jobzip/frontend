const MAX_VISIBLE_PAGE_BUTTONS = 5;

function createVisiblePages(
  currentPage,
  totalPages,
) {
  const halfVisiblePages = Math.floor(
    MAX_VISIBLE_PAGE_BUTTONS / 2,
  );
  const maxStartPage = Math.max(
    totalPages - MAX_VISIBLE_PAGE_BUTTONS,
    0,
  );
  const startPage = Math.min(
    Math.max(
      currentPage - halfVisiblePages,
      0,
    ),
    maxStartPage,
  );
  const endPage = Math.min(
    startPage + MAX_VISIBLE_PAGE_BUTTONS,
    totalPages,
  );

  return Array.from(
    { length: endPage - startPage },
    (_, index) => startPage + index,
  );
}

export function JobPagination({
  currentPage,
  pageSize,
  totalElements,
  onPageChange,
  isLoading = false,
}) {
  if (pageSize <= 0) {
    return null;
  }

  const totalPages = Math.ceil(
    totalElements / pageSize,
  );

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = createVisiblePages(
    currentPage,
    totalPages,
  );
  const isFirstPage = currentPage === 0;
  const isLastPage =
    currentPage === totalPages - 1;

  return (
    <nav
      className="job-pagination"
      aria-label="채용공고 페이지 이동"
    >
      <button
        type="button"
        disabled={isLoading || isFirstPage}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        이전
      </button>

      {visiblePages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          aria-current={
            pageNumber === currentPage
              ? "page"
              : undefined
          }
          disabled={isLoading}
          onClick={() =>
            onPageChange(pageNumber)
          }
        >
          {pageNumber + 1}
        </button>
      ))}

      <button
        type="button"
        disabled={isLoading || isLastPage}
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        다음
      </button>
    </nav>
  );
}