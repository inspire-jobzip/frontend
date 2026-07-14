import {
  DEFAULT_JOB_NOTICE_PAGE,
  DEFAULT_JOB_NOTICE_PAGE_SIZE,
} from "./jobNotices.constants";

function normalizeText(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function normalizeSkillNames(skillNames) {
  if (!Array.isArray(skillNames)) {
    return [];
  }

  const uniqueSkillNames = new Map();

  skillNames.forEach((skillName) => {
    const normalizedSkillName =
      normalizeText(skillName);

    if (!normalizedSkillName) {
      return;
    }

    const duplicateKey =
      normalizedSkillName.toLowerCase();

    if (!uniqueSkillNames.has(duplicateKey)) {
      uniqueSkillNames.set(
        duplicateKey,
        normalizedSkillName,
      );
    }
  });

  return Array.from(uniqueSkillNames.values());
}

export function createJobNoticesSearchParams({
  filters = {},
  page = DEFAULT_JOB_NOTICE_PAGE,
  size = DEFAULT_JOB_NOTICE_PAGE_SIZE,
} = {}) {
  const searchParams = new URLSearchParams();
  const keyword = normalizeText(filters.keyword);
  const jobRole = normalizeText(filters.jobRole);
  const experienceLevel = normalizeText(
    filters.experienceLevel,
  );
  const location = normalizeText(filters.location);
  const sort = normalizeText(filters.sort);
  const skillNames = normalizeSkillNames(
    filters.skillNames,
  );

  if (keyword) {
    searchParams.set("keyword", keyword);
  }

  if (jobRole) {
    searchParams.set("jobRole", jobRole);
  }

  if (skillNames.length > 0) {
    searchParams.set(
      "skillNames",
      skillNames.join(","),
    );
  }

  if (
    experienceLevel &&
    experienceLevel !== "ANY"
  ) {
    searchParams.set(
      "experienceLevel",
      experienceLevel,
    );
  }

  if (location) {
    searchParams.set("location", location);
  }

  if (sort) {
    searchParams.set("sort", sort);
  }

  searchParams.set("page", String(page));
  searchParams.set("size", String(size));

  return searchParams;
}