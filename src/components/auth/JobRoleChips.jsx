import {
  DESIRED_JOB_ROLES,
  DESIRED_JOB_ROLE_LABELS,
} from "../../api/auth/auth.constants";

export function JobRoleChips({
  selectedRole,
  onChange,
}) {
  return (
    <div className="job-role-chips">
      {DESIRED_JOB_ROLES.map((role) => {
        const isSelected = selectedRole === role;

        return (
          <button
            key={role}
            className={
              isSelected
                ? "job-role-chips__item job-role-chips__item--selected"
                : "job-role-chips__item"
            }
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(role)}
          >
            {DESIRED_JOB_ROLE_LABELS[role]}
          </button>
        );
      })}
    </div>
  );
}