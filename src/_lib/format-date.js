const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const talkFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

function ordinalSuffix(day) {
  const remainder = day % 100;
  if (remainder >= 11 && remainder <= 13) return "th";

  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function parseDate(value) {
  if (!value) return null;

  const source = value instanceof Date ? value : String(value);
  const date = source.length === 10 ? new Date(`${source}T00:00:00Z`) : new Date(source);

  return Number.isNaN(date.getTime()) ? null : date;
}

// Formats a Date, an ISO string, or a YYYY-MM-DD string as DD/MM/YYYY.
// UTC is used so build-time dates do not shift around the world.
export function formatDate(value) {
  const date = parseDate(value);
  return date ? formatter.format(date) : "";
}

// Formats a talk date as "Thursday 19th November". The year is kept in the
// <time datetime> attribute, but left out of the visible label.
export function formatTalkDate(value) {
  const date = parseDate(value);
  if (!date) return "";

  const parts = talkFormatter.formatToParts(date);
  const day = Number(parts.find((part) => part.type === "day").value);
  const weekday = parts.find((part) => part.type === "weekday").value;
  const month = parts.find((part) => part.type === "month").value;

  return `${weekday} ${day}${ordinalSuffix(day)} ${month}`;
}
