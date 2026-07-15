export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(date.getDate()).padStart(
    2,
    "0",
  );

  return `${year}-${month}-${day}`;
}

export function getEventDateKey(deadlineAt) {
  return typeof deadlineAt === "string"
    ? deadlineAt.slice(0, 10)
    : "";
}

export function getCalendarDays(visibleMonth) {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const gridStart = new Date(
    year,
    month,
    1 - firstDay.getDay(),
  );

  return Array.from({ length: 42 }, (_, index) =>
    new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    ),
  );
}

export function getEventTone(event) {
  const status = event.recruitStatus?.toUpperCase();
  const colorType = event.colorType?.toUpperCase();

  if (status === "CLOSED" || colorType === "RED") {
    return "closed";
  }

  if (
    status === "CLOSING_SOON" ||
    colorType === "YELLOW" ||
    colorType === "AMBER" ||
    (typeof event.daysUntilDeadline === "number" &&
      event.daysUntilDeadline >= 0 &&
      event.daysUntilDeadline <= 3)
  ) {
    return "closing-soon";
  }

  return "open";
}

export function getDeadlineLabel(event) {
  if (event.recruitStatus?.toUpperCase() === "CLOSED") {
    return "마감";
  }

  const daysUntilDeadline =
    typeof event.daysUntilDeadline === "number"
      ? event.daysUntilDeadline
      : getDaysUntilDeadline(event.deadlineAt);

  if (daysUntilDeadline === 0) {
    return "D-Day";
  }

  if (typeof daysUntilDeadline === "number") {
    return daysUntilDeadline > 0
      ? `D-${daysUntilDeadline}`
      : "마감";
  }

  return event.recruitStatusText;
}

function getDaysUntilDeadline(deadlineAt) {
  if (typeof deadlineAt !== "string") return null;

  const [year, month, day] = deadlineAt
    .slice(0, 10)
    .split("-")
    .map(Number);
  if (![year, month, day].every(Number.isInteger)) return null;

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const deadlineUtc = Date.UTC(year, month - 1, day);

  return Math.round((deadlineUtc - todayUtc) / 86_400_000);
}
