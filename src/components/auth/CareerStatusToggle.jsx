import {
  CAREER_STATUSES,
  CAREER_STATUS_LABELS,
} from "../../api/auth/auth.constants";

export function CareerStatusToggle({
  selectedStatus,
  onChange,
}) {
  return (
    <div className="career-status-toggle">
      {CAREER_STATUSES.map((status) => {
        const isSelected =
          selectedStatus === status;

        return (
          <button
            key={status}
            className={
              isSelected
                ? "career-status-toggle__item career-status-toggle__item--selected"
                : "career-status-toggle__item"
            }
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(status)}
          >
            {CAREER_STATUS_LABELS[status]}
          </button>
        );
      })}
    </div>
  );
}