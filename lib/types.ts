// ────────────────────────────────────────────────────────────────────────────
// Gingermood — Adaptive Match Demo · core type model
//
// Design note: matching is driven by a SHARED TAG VOCABULARY.
//  - Coaches declare *weighted competencies* (which idiosyncratic needs they are
//    genuinely strong at, and how strong).
//  - The intake produces *need tags* describing one person's specific situation.
//  - The matcher scores the overlap, per dimension.
// This is deliberately NOT personality/similarity matching — it links a person's
// specific needs to a coach's actual competencies, and can explain why.
// All data in this app is SYNTHETIC sample data.
// ────────────────────────────────────────────────────────────────────────────

export type Locale = "nl" | "en";

/** The seven coarse need-clusters. Each coach "owns" one (the generalist spans all). */
export type Specialism =
  | "stress-burnout"
  | "leadership-transition"
  | "career-direction"
  | "confidence-imposter"
  | "high-pressure-exec"
  | "communication-assertiveness"
  | "generalist";

/** Coaching methods (shown for transparency; lightly weighted in matching). */
export type Method =
  | "ACT"
  | "oplossingsgericht"
  | "systemisch"
  | "somatisch"
  | "cognitief"
  | "positieve-psychologie";

export type Sector =
  | "finance"
  | "consultancy"
  | "zorg"
  | "tech"
  | "publiek"
  | "onderwijs"
  | "creatief";

export type WorkingStyle =
  | "directief"
  | "reflectief"
  | "gestructureerd"
  | "verkennend"
  | "warm"
  | "pragmatisch";

/**
 * Fine-grained, idiosyncratic need tags — the real currency of matching.
 * These are deliberately more specific than the coarse Specialism clusters,
 * so two people in the same cluster can still match different coaches.
 */
export type NeedTag =
  // stress / burnout cluster
  | "stress-burnout"
  | "energieherstel"
  | "werk-prive-balans"
  | "grenzen-stellen"
  | "perfectionisme"
  // leadership transition cluster
  | "eerste-leidinggevende"
  | "delegeren"
  | "rolverandering"
  | "feedback-geven"
  // career direction cluster
  | "loopbaankeuze"
  | "zingeving-identiteit"
  | "heroriëntatie"
  // confidence / imposter cluster
  | "zelfvertrouwen"
  | "imposter"
  | "zichtbaarheid"
  // high-pressure exec cluster
  | "hoge-druk-executive"
  | "besluitvorming"
  | "strategische-eenzaamheid"
  // communication / assertiveness cluster
  | "communicatie-assertiviteit"
  | "conflicthantering"
  | "presentie-overtuigingskracht";

export type Format = "online" | "in-persoon" | "hybride" | "geen-voorkeur";
export type Urgency = "laag" | "gemiddeld" | "hoog";

/** A single weighted competency: how strong a coach is at a specific need. */
export interface Competency {
  tag: NeedTag;
  /** 1 = can help · 2 = strong · 3 = signature strength */
  weight: 1 | 2 | 3;
}

// ── Coach (synthetic) ────────────────────────────────────────────────────────
export interface Coach {
  id: string;
  name: string; // fictional
  /** Two-letter initials used to render an illustrated avatar (NOT a real photo). */
  initials: string;
  /** Accent colour token for the avatar tile. */
  accent: "terracotta" | "sage" | "amber" | "clay" | "ink" | "rose" | "olive";
  gender: "F" | "M";
  region: string;
  languages: Locale[];
  yearsExperience: number;
  specialisms: Specialism[];
  /** Weighted competencies — the basis for needs↔competency scoring. */
  competencies: Competency[];
  methods: Method[];
  sectorExperience: Sector[];
  /** Plain-language descriptors of who they suit. */
  bestFitFor: string[];
  workingStyle: WorkingStyle[];
  /** 2–3 sentence synthetic bio. */
  bio: string;
  /** A short, quotable line shown on the coach card. */
  tagline: string;
}

// ── Intake / needs profile (the "digital profile") ───────────────────────────
export interface SpecificNeed {
  /** Idiosyncratic, human phrasing of the need. */
  text: string;
  tags: NeedTag[];
}

export interface PracticalConstraints {
  language: Locale;
  region: string;
  format: Format;
}

export interface NeedsProfile {
  presentingThemes: string[];
  specificNeeds: SpecificNeed[];
  desiredCoachCharacteristics: string[];
  workingStylePrefs: WorkingStyle[];
  practicalConstraints: PracticalConstraints;
  urgency: Urgency;
}

// ── Match output ─────────────────────────────────────────────────────────────
export interface FitDimension {
  /** e.g. "Behoefte ↔ expertise", "Werkwijze & stijl", "Context & sector", "Praktisch". */
  dimension: string;
  /** 0–100 */
  score: number;
  /** Short, specific justification for this dimension. */
  note: string;
}

/** An explicit link between one of the person's needs and a coach strength. */
export interface NeedEvidence {
  need: string;
  coachStrength: string;
}

export interface Match {
  coachId: string;
  /** 0–100 overall fit. */
  fitScore: number;
  /** Idiosyncratic-fit framed paragraph: why THIS coach for THESE needs. */
  reasoning: string;
  /** The concrete need→competency links that justify the match. */
  evidence: NeedEvidence[];
  fitBreakdown: FitDimension[];
  runnerUpId: string;
  /** One line on why the runner-up is the sensible second option. */
  runnerUpReason: string;
}

// ── Adaptive question flow ────────────────────────────────────────────────────
export type QuestionKind = "open" | "single" | "multi";

/** A tappable suggestion that also carries the tags it contributes when chosen. */
export interface Chip {
  label: string;
  needTags?: NeedTag[];
  styleTags?: WorkingStyle[];
  sectors?: Sector[];
  /** Structured value for hard-filter questions (format/gender/language/city/range). */
  value?: string;
}

/** A question presented to the user (from AI or the fallback bank). */
export interface Question {
  id: string;
  prompt: string;
  helper?: string;
  /** What signal this question is trying to surface. */
  dimensionProbed: string;
  chips: Chip[];
  kind: QuestionKind;
  allowCustom: boolean;
}

/** The user's answer to one question. */
export interface Answer {
  questionId: string;
  prompt: string;
  dimensionProbed: string;
  /** Free-text portion (may be empty if only chips chosen). */
  text: string;
  /** Chips the user tapped. */
  selectedChips: Chip[];
}

// ── Personas (synthetic, pre-filled) ──────────────────────────────────────────
export interface Persona {
  id: string;
  label: string;
  blurb: string;
  initials: string;
  accent: Coach["accent"];
  /** Pre-filled answers so the demo can run instantly without typing. */
  answers: Answer[];
  /** The coach this persona is tuned to match (used to sanity-check the engine). */
  intendedCoachId: string;
}

// ── API contracts (server routes) ─────────────────────────────────────────────
export type EngineSource = "ai" | "fallback";

export interface NextQuestionRequest {
  locale: Locale;
  answers: Answer[];
  askedIds: string[];
}

export interface NextQuestionResponse {
  done: boolean;
  question: Question | null;
  /** How many questions we expect in total, for the progress indicator. */
  expectedTotal: number;
  source: EngineSource;
}

/** Hard up-front constraints that pre-filter the coach pool. */
export interface MatchFilters {
  format: Format | "geen-voorkeur";
  genderPref: "F" | "M" | "geen-voorkeur";
  language: Locale | "geen-voorkeur";
  city?: string;
  rangeKm?: number;
}

export interface MatchRequest {
  locale: Locale;
  answers: Answer[];
  filters?: MatchFilters;
}

export interface MatchResponse {
  profile: NeedsProfile;
  match: Match;
  coach: Coach;
  runnerUp: Coach;
  source: EngineSource;
}
