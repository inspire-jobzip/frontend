export const CALENDAR_JOB_NOTICES_ENDPOINT =
  "/calendar/job-notices";

export const CALENDAR_BOOKMARKS_ENDPOINT =
  "/calendar/bookmarks";

export const CALENDAR_VIEWS = {
  ALL: "all",
  BOOKMARKS: "bookmarks",
};

export const DEFAULT_CALENDAR_FILTERS = {
  jobRole: "",
  skillNames: [],
};

export const CALENDAR_STATUS_META = {
  OPEN: {
    label: "모집 중",
    tone: "open",
  },
  CLOSING_SOON: {
    label: "마감 임박",
    tone: "closing-soon",
  },
  CLOSED: {
    label: "마감",
    tone: "closed",
  },
};
