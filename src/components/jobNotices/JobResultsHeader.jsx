import {
  JOB_NOTICE_SORT_LABELS,
  JOB_NOTICE_SORT_OPTIONS,
} from "../../api/jobNotices/jobNotices.constants";

export function JobResultsHeader({
  totalElements,
  sort,
  onSortChange,
  isLoading = false,
}) {
  return (
    <div className="job-results-header">
      <p
        className="job-results-header__count"
        aria-live="polite"
      >
        총 <strong>{totalElements}</strong>개의
        채용공고
      </p>

      <label className="job-results-header__sort">
        <span>정렬</span>

        <select
          value={sort}
          disabled={isLoading}
          onChange={(event) =>
            onSortChange(event.target.value)
          }
        >
          {JOB_NOTICE_SORT_OPTIONS.map(
            (sortOption) => (
              <option
                key={sortOption}
                value={sortOption}
              >
                {
                  JOB_NOTICE_SORT_LABELS[
                    sortOption
                  ]
                }
              </option>
            ),
          )}
        </select>
      </label>
    </div>
  );
}