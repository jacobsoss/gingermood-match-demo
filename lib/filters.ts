import type { Answer, Coach, MatchFilters, Question, RangeInfo } from "@/lib/types";
import { cityDistanceKm, withinRange } from "@/lib/geo";

/**
 * Hard, up-front filter questions asked BEFORE the curated/adaptive intake.
 * These produce HARD constraints (MatchFilters) that pre-filter the coach pool
 * (gender, language, in-person location range). Online/no-preference skips location.
 */

const FORMAT_Q: Question = {
  id: "filter-format",
  prompt: "Hoe wil je het liefst coachen?",
  helper: "Dit bepaalt of locatie meespeelt.",
  dimensionProbed: "Vorm",
  kind: "single",
  allowCustom: false,
  chips: [
    { label: "Online", value: "online" },
    { label: "In persoon", value: "in-persoon" },
    { label: "Hybride", value: "hybride" },
    { label: "Geen voorkeur", value: "geen-voorkeur" },
  ],
};

const CITY_Q: Question = {
  id: "filter-city",
  prompt: "In welke plaats zoek je een coach?",
  helper: "Zoek je plaats — typ om te verfijnen.",
  dimensionProbed: "Locatie",
  kind: "single",
  allowCustom: true,
  widget: "city",
  chips: [],
};

const RANGE_Q: Question = {
  id: "filter-range",
  prompt: "Hoe ver wil je reizen voor een gesprek?",
  dimensionProbed: "Reisafstand",
  kind: "single",
  allowCustom: false,
  chips: [
    { label: "Tot 10 km", value: "10" },
    { label: "Tot 25 km", value: "25" },
    { label: "Tot 50 km", value: "50" },
    { label: "Tot 100 km", value: "100" },
    { label: "Heel Nederland", value: "0" },
  ],
};

const GENDER_Q: Question = {
  id: "filter-gender",
  prompt: "Heb je een voorkeur voor een vrouwelijke of mannelijke coach?",
  dimensionProbed: "Voorkeur coach",
  kind: "single",
  allowCustom: false,
  chips: [
    { label: "Vrouw", value: "F" },
    { label: "Man", value: "M" },
    { label: "Geen voorkeur", value: "geen-voorkeur" },
  ],
};

const LANGUAGE_Q: Question = {
  id: "filter-language",
  prompt: "In welke taal wil je de gesprekken voeren?",
  dimensionProbed: "Taal",
  kind: "single",
  allowCustom: false,
  chips: [
    { label: "Nederlands", value: "nl" },
    { label: "Engels", value: "en" },
  ],
};

// Asked AFTER the hard filters, BEFORE the adaptive (soft) intake. Lets the user
// pick how deep to go — and sets how many adaptive questions actually get asked.
const DEPTH_Q: Question = {
  id: "filter-depth",
  prompt: "Hoeveel tijd wil je nemen?",
  helper:
    "Hoe meer je deelt, hoe scherper je match. Maar kort werkt ook prima — jij bepaalt het tempo.",
  dimensionProbed: "Diepgang",
  kind: "single",
  allowCustom: false,
  chips: [
    { label: "Kort · 3 vragen", value: "kort" },
    { label: "Gemiddeld · 5 vragen", value: "middel" },
    { label: "Uitgebreid · 8 vragen", value: "lang" },
  ],
};

/** Intake "depth" the user chose, and how many adaptive questions it maps to. */
export type IntakeDepth = "kort" | "middel" | "lang";
const DEPTH_COUNTS: Record<IntakeDepth, number> = { kort: 3, middel: 5, lang: 8 };

export function intakeDepth(answers: Answer[]): IntakeDepth {
  const v = chipValue(answers, "filter-depth");
  return v === "kort" || v === "lang" ? v : "middel";
}

/** Target number of adaptive (soft) intake questions, from the depth choice. */
export function intakeCount(answers: Answer[]): number {
  return DEPTH_COUNTS[intakeDepth(answers)];
}

function chipValue(answers: Answer[], id: string): string | undefined {
  const a = answers.find((x) => x.questionId === id);
  return a?.selectedChips[0]?.value;
}

function cityValue(answers: Answer[]): string | undefined {
  const a = answers.find((x) => x.questionId === "filter-city");
  return a?.selectedChips[0]?.value ?? (a?.text?.trim() || undefined);
}

function needsLocation(answers: Answer[]): boolean {
  const f = chipValue(answers, "filter-format");
  return f === "in-persoon" || f === "hybride";
}

/** The fixed filter sequence; returns the next unanswered filter question, or null. */
export function selectNextFilter(answers: Answer[]): Question | null {
  const asked = new Set(answers.map((a) => a.questionId));
  const order: Question[] = [FORMAT_Q];
  if (needsLocation(answers)) order.push(CITY_Q, RANGE_Q);
  order.push(GENDER_Q, LANGUAGE_Q, DEPTH_Q);
  for (const q of order) {
    if (!asked.has(q.id)) return q;
  }
  return null;
}

/** How many filter questions this run will have (for the progress indicator). */
export function filterTotal(answers: Answer[]): number {
  const format = chipValue(answers, "filter-format");
  const base = format === undefined ? 5 : needsLocation(answers) ? 5 : 3;
  return base + 1; // + the intake-depth question (always asked)
}

export function isFilterQuestion(id: string): boolean {
  return id.startsWith("filter-");
}

/** Derive the hard constraints from the filter answers (defaults = no filter). */
export function extractFilters(answers: Answer[]): MatchFilters {
  const range = chipValue(answers, "filter-range");
  return {
    format: (chipValue(answers, "filter-format") as MatchFilters["format"]) ?? "geen-voorkeur",
    genderPref: (chipValue(answers, "filter-gender") as MatchFilters["genderPref"]) ?? "geen-voorkeur",
    language: (chipValue(answers, "filter-language") as MatchFilters["language"]) ?? "geen-voorkeur",
    city: cityValue(answers),
    rangeKm: range !== undefined ? Number(range) : undefined,
  };
}

/** Whether the in-person/hybrid range constraint is active for these filters. */
function rangeActive(f: MatchFilters): boolean {
  return (
    (f.format === "in-persoon" || f.format === "hybride") &&
    !!f.city &&
    !!f.rangeKm &&
    f.rangeKm > 0
  );
}

/** Coaches passing the soft-never preferences: gender + language (hard, never relaxed). */
function passesPrefs(c: Coach, f: MatchFilters): boolean {
  if (f.genderPref !== "geen-voorkeur" && c.gender !== f.genderPref) return false;
  if (f.language !== "geen-voorkeur" && !c.languages.includes(f.language as Coach["languages"][number]))
    return false;
  return true;
}

/** Coaches satisfying ALL hard constraints (gender, language, in-person range). */
export function eligibleCoaches(coaches: Coach[], f: MatchFilters): Coach[] {
  const base = coaches.filter((c) => passesPrefs(c, f));
  if (!rangeActive(f)) return base;
  return base.filter((c) => withinRange(c.region, f.city!, f.rangeKm!));
}

export interface PoolResult {
  pool: Coach[];
  rangeInfo?: RangeInfo;
}

/**
 * The pool to match over. Gender + language are HARD and never relaxed. The
 * in-person range is also hard: coaches within radius are used as-is (even if
 * that leaves a single coach). Only when NOBODY is within radius do we auto-widen
 * — falling back to the nearest coaches and flagging it so the UI shows a notice.
 */
export function poolForFilters(coaches: Coach[], f: MatchFilters): PoolResult {
  let base = coaches.filter((c) => passesPrefs(c, f));
  // Safety net for an impossible gender+language combo (shouldn't happen here).
  if (base.length === 0) base = coaches;

  if (!rangeActive(f)) return { pool: base };

  const city = f.city!;
  const km = f.rangeKm!;
  const inRange = base.filter((c) => withinRange(c.region, city, km));
  if (inRange.length >= 1) return { pool: inRange };

  // Auto-widen: nobody in radius — show the nearest coaches, with a notice.
  const ranked = base
    .map((c) => ({ c, d: cityDistanceKm(c.region, city) ?? Infinity }))
    .sort((a, b) => a.d - b.d);
  const nearest = ranked[0]?.d;
  return {
    pool: ranked.map((x) => x.c),
    rangeInfo: {
      relaxed: true,
      city,
      requestedKm: km,
      nearestKm: nearest !== undefined && Number.isFinite(nearest) ? Math.round(nearest) : km,
    },
  };
}
