const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

// Formats a Date, an ISO string, or a YYYY-MM-DD string as DD/MM/YYYY.
// UTC is used so build-time dates do not shift around the world.
export function formatDate(value) {
  if (!value) return "";

  const source = value instanceof Date ? value : String(value);
  const date = source.length === 10 ? new Date(`${source}T00:00:00Z`) : new Date(source);

  if (Number.isNaN(date.getTime())) return "";

  return formatter.format(date);
}
