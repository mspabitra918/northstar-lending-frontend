/**
 * Application-wide time zone. Per business rule, every application timestamp on
 * northstarlend.com is recorded and displayed in US Pacific Time. We use the
 * IANA zone (not a fixed "PST" offset) so daylight saving is handled
 * automatically — PST (UTC−8) in winter, PDT (UTC−7) in summer.
 */
export const APP_TIME_ZONE = "America/Los_Angeles";

/** Today's date as a YYYY-MM-DD string in Pacific time. */
export function todayISO(): string {
  // en-CA renders as YYYY-MM-DD.
  return new Date().toLocaleDateString("en-CA", { timeZone: APP_TIME_ZONE });
}

/**
 * Pacific-time offset in minutes, using the JS `Date.getTimezoneOffset()`
 * convention (UTC − local): 480 during PST, 420 during PDT. Computed for the
 * given instant so a date that falls in a different DST period than "now"
 * still gets the correct offset.
 */
export function tzOffsetMinutes(date: Date = new Date()): number {
  if (Number.isNaN(date.getTime())) return 0;
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  const local = new Date(
    date.toLocaleString("en-US", { timeZone: APP_TIME_ZONE }),
  );
  return Math.round((utc.getTime() - local.getTime()) / 60000);
}

/** Short date in Pacific time, e.g. "May 27, 2026". */
export function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: APP_TIME_ZONE,
  });
}

/** Date + time in Pacific time, e.g. "May 27, 2026, 2:14 PM PDT". */
export function formatDateTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: APP_TIME_ZONE,
    timeZoneName: "short",
  });
}
