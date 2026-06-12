/**
 * Pure .ics (RFC 5545) helpers for "Add to calendar" — zero dependencies.
 * Client-only: `downloadIcs` touches the DOM, so call it from event handlers.
 */

export interface IcsEventInput {
  title: string;
  description?: string;
  /** ISO datetime of the event start. */
  startISO: string;
  durationMin: number;
  location?: string;
}

/** UTC basic format required by DTSTART/DTEND: YYYYMMDDTHHMMSSZ. */
function toUtcBasic(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`
  );
}

/** Escape TEXT values per RFC 5545 §3.3.11 (backslash, semicolon, comma, newline). */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold lines longer than 75 octets with a CRLF + single space (RFC 5545 §3.1). */
function fold(line: string): string {
  const out: string[] = [];
  let rest = line;
  let first = true;
  while (rest.length > (first ? 73 : 72)) {
    const take = first ? 73 : 72;
    out.push((first ? "" : " ") + rest.slice(0, take));
    rest = rest.slice(take);
    first = false;
  }
  out.push((first ? "" : " ") + rest);
  return out.join("\r\n");
}

/** Build a single-event VCALENDAR string most calendar apps accept happily. */
export function buildIcs({
  title,
  description,
  startISO,
  durationMin,
  location,
}: IcsEventInput): string {
  const start = new Date(startISO);
  const end = new Date(start.getTime() + durationMin * 60_000);
  const dtStart = toUtcBasic(start);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gingermood//Demo//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:gingermood-${dtStart}@gingermood.nl`,
    `DTSTAMP:${toUtcBasic(new Date())}`,
    `DTSTART:${dtStart}`,
    `DTEND:${toUtcBasic(end)}`,
    `SUMMARY:${escapeText(title)}`,
  ];
  if (description) lines.push(`DESCRIPTION:${escapeText(description)}`);
  if (location) lines.push(`LOCATION:${escapeText(location)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.map(fold).join("\r\n") + "\r\n";
}

/** Trigger a client-side download of the given .ics content. */
export function downloadIcs(filename: string, ics: string): void {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick so the download has started before cleanup.
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
