import type { Answer, Coach, MatchFilters, Question } from "@/lib/types";
import { CITY_OPTIONS, withinRange } from "@/lib/geo";

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
  helper: "Kies je plaats of typ er een.",
  dimensionProbed: "Locatie",
  kind: "single",
  allowCustom: true,
  chips: CITY_OPTIONS.map((c) => ({ label: c, value: c })),
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
  order.push(GENDER_Q, LANGUAGE_Q);
  for (const q of order) {
    if (!asked.has(q.id)) return q;
  }
  return null;
}

/** How many filter questions this run will have (for the progress indicator). */
export function filterTotal(answers: Answer[]): number {
  const format = chipValue(answers, "filter-format");
  if (format === undefined) return 5; // assume max until format chosen
  return needsLocation(answers) ? 5 : 3;
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

/** Coaches satisfying the hard constraints (gender, language, in-person range). */
export function eligibleCoaches(coaches: Coach[], f: MatchFilters): Coach[] {
  return coaches.filter((c) => {
    if (f.genderPref !== "geen-voorkeur" && c.gender !== f.genderPref) return false;
    if (f.language !== "geen-voorkeur" && !c.languages.includes(f.language as Coach["languages"][number]))
      return false;
    if ((f.format === "in-persoon" || f.format === "hybride") && f.city && f.rangeKm && f.rangeKm > 0) {
      if (!withinRange(c.region, f.city, f.rangeKm)) return false;
    }
    return true;
  });
}

/**
 * The pool to match over: eligible coaches if the constraints leave at least 2,
 * otherwise relax to the full pool so the flow never dead-ends. Returns the pool
 * and whether constraints were relaxed.
 */
export function poolForFilters(coaches: Coach[], f: MatchFilters): { pool: Coach[]; relaxed: boolean } {
  const elig = eligibleCoaches(coaches, f);
  return elig.length >= 2 ? { pool: elig, relaxed: false } : { pool: coaches, relaxed: true };
}
