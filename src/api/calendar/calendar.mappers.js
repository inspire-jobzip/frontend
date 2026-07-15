function normalizeSkillNames(skillNames) {
  if (!Array.isArray(skillNames)) {
    return [];
  }

  return Array.from(
    new Set(
      skillNames
        .map((skillName) => skillName.trim())
        .filter(Boolean),
    ),
  );
}

export function createCalendarSearchParams({
  year,
  month,
  filters = {},
  includeFilters = true,
}) {
  const searchParams = new URLSearchParams({
    year: String(year),
    month: String(month),
  });

  if (!includeFilters) {
    return searchParams;
  }

  const jobRole =
    typeof filters.jobRole === "string"
      ? filters.jobRole.trim()
      : "";
  const skillNames = normalizeSkillNames(
    filters.skillNames,
  );

  if (jobRole) {
    searchParams.set("jobRole", jobRole);
  }

  if (skillNames.length > 0) {
    searchParams.set(
      "skillNames",
      skillNames.join(","),
    );
  }

  return searchParams;
}
