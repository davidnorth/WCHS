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

// Returns the Europe/London UTC offset ("+01:00" or "+00:00") on a given date,
// so event structured data carries the correct offset through BST changes.
function londonOffset(isoDate) {
  const probe = new Date(`${isoDate}T12:00:00Z`);
  const name = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    timeZoneName: "longOffset",
  })
    .formatToParts(probe)
    .find((part) => part.type === "timeZoneName")?.value;

  const match = /GMT([+-]\d{2}:\d{2})/.exec(name || "");
  return match ? match[1] : "+00:00";
}

// Combines an ISO date and a display time such as "7:30pm" into an ISO 8601
// timestamp with the correct London offset, for schema.org Event data.
export function toEventStart(dateValue, time) {
  const date = parseDate(dateValue);
  if (!date) return "";

  const isoDate = date.toISOString().slice(0, 10);
  const match = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i.exec(
    String(time || "").trim(),
  );

  if (!match) return `${isoDate}T19:30:00${londonOffset(isoDate)}`;

  let hours = Number(match[1]) % 12;
  if (match[3].toLowerCase() === "pm") hours += 12;
  const minutes = Number(match[2] || 0);

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  return `${isoDate}T${hh}:${mm}:00${londonOffset(isoDate)}`;
}
