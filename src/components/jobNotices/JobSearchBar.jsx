export function JobSearchBar({
  value,
  onChange,
  onSubmit,
  isLoading = false,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      className="job-search-bar"
      role="search"
      onSubmit={handleSubmit}
    >
      <label
        className="job-search-bar__label"
        htmlFor="job-notice-keyword"
      >
        채용공고 검색
      </label>

      <span
        className="job-search-bar__icon"
        aria-hidden="true"
      >
        ⌕
      </span>

      <input
        id="job-notice-keyword"
        type="search"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="회사명 또는 공고명을 검색해보세요"
        autoComplete="off"
      />

      <button
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "검색 중" : "검색"}
      </button>
    </form>
  );
}