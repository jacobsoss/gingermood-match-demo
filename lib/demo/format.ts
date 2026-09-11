/** Date/text formatting for the platform. Locale follows the chosen UI language. */

type DateLang = "en" | "nl";
const LOCALE: Record<DateLang, string> = { en: "en-GB", nl: "nl-NL" };

export function formatDay(iso: string, lang: DateLang = "en"): string {
  return new Date(iso).toLocaleDateString(LOCALE[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatDayShort(iso: string, lang: DateLang = "en"): string {
  return new Date(iso).toLocaleDateString(LOCALE[lang], {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatTime(iso: string, lang: DateLang = "en"): string {
  return new Date(iso).toLocaleTimeString(LOCALE[lang], { hour: "2-digit", minute: "2-digit" });
}

export function formatDayTime(iso: string, lang: DateLang = "en"): string {
  return `${formatDayShort(iso, lang)} · ${formatTime(iso, lang)}`;
}

/** "Good morning" / "Good afternoon" / "Good evening". */
export function timeGreeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/** Time-of-day bucket, so the greeting can be looked up from the copy layer. */
export function timeOfDay(d = new Date()): "morning" | "afternoon" | "evening" {
  const h = d.getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

/** "3 weeks ago", "yesterday", "today" — rough, friendly. Localised per language. */
export function timeAgo(iso: string, lang: DateLang = "en", now = new Date()): string {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
  if (lang === "nl") {
    if (days <= 0) return "vandaag";
    if (days === 1) return "gisteren";
    if (days < 7) return `${days} dagen geleden`;
    const weeks = Math.round(days / 7);
    return weeks === 1 ? "vorige week" : `${weeks} weken geleden`;
  }
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  return weeks === 1 ? "last week" : `${weeks} weeks ago`;
}

export function firstName(name: string): string {
  return name.split(" ")[0] ?? name;
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}
