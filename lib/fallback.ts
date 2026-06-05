import type {
  Answer,
  Coach,
  Format,
  Match,
  NeedsProfile,
  NeedTag,
  Sector,
  SpecificNeed,
  Urgency,
  WorkingStyle,
} from "@/lib/types";
import { COACHES, getCoach } from "@/data/coaches";
import { extractFilters } from "@/lib/filters";
import {
  QUESTION_BANK,
  QUESTION_BANK_BY_ID,
  toQuestion,
  type BankQuestion,
} from "@/data/questionBank";
import {
  CLUSTER_OF,
  KEYWORD_TAGS,
  NEED_PHRASE,
  SPECIALISM_THEME,
  STRENGTH_PHRASE,
} from "@/lib/taxonomy";

// ────────────────────────────────────────────────────────────────────────────
// Deterministic engine — powers Demo/Scripted mode and graceful degradation.
// Pure functions, safe to import on the client. Zero API calls.
// ────────────────────────────────────────────────────────────────────────────

export interface Signals {
  needWeights: Map<NeedTag, number>;
  styles: Map<WorkingStyle, number>;
  sectors: Set<Sector>;
  format: Format;
  /** Idiosyncratic free-text needs captured along the way. */
  freeTexts: string[];
}

const MAX_TAG_WEIGHT = 3;

function bump<K>(map: Map<K, number>, key: K, by = 1) {
  map.set(key, Math.min(MAX_TAG_WEIGHT, (map.get(key) ?? 0) + by));
}

/** Collect all signal from the answers so far. */
export function collectSignals(answers: Answer[]): Signals {
  const needWeights = new Map<NeedTag, number>();
  const styles = new Map<WorkingStyle, number>();
  const sectors = new Set<Sector>();
  let format: Format = "geen-voorkeur";
  const freeTexts: string[] = [];

  for (const a of answers) {
    for (const chip of a.selectedChips) {
      chip.needTags?.forEach((t) => bump(needWeights, t));
      chip.styleTags?.forEach((s) => bump(styles, s));
      chip.sectors?.forEach((s) => sectors.add(s));
    }
    // Format from the up-front hard filter (carries a structured value).
    if (a.questionId === "filter-format" && a.selectedChips[0]?.value) {
      format = a.selectedChips[0].value as Format;
    }
    // Legacy: format from the bank's practical question (used by personas).
    if (a.questionId === "practical-format" && a.selectedChips[0]) {
      const label = a.selectedChips[0].label.toLowerCase();
      if (label.includes("online")) format = "online";
      else if (label.includes("persoon")) format = "in-persoon";
      else if (label.includes("hybride")) format = "hybride";
      else format = "geen-voorkeur";
    }
    // Free text contributes via a light keyword scan (robust to typing, not tapping).
    if (a.text && a.text.trim().length > 0) {
      freeTexts.push(a.text.trim());
      for (const { re, tags } of KEYWORD_TAGS) {
        if (re.test(a.text)) tags.forEach((t) => bump(needWeights, t, 1));
      }
    }
  }

  return { needWeights, styles, sectors, format, freeTexts };
}

// ── Adaptive question selection (the deterministic "branch") ──────────────────
const SEEDS = QUESTION_BANK.filter((q) => q.stage === "seed").sort(
  (a, b) => b.priority - a.priority,
);
const ADAPTIVE = QUESTION_BANK.filter((q) => q.stage === "adaptive");
const PRACTICAL = QUESTION_BANK.find((q) => q.stage === "practical")!;
const CHARACTERISTICS = QUESTION_BANK.find((q) => q.stage === "characteristics")!;

const MAX_ADAPTIVE = 2;

function adaptiveScore(q: BankQuestion, signals: Signals): number {
  if (!q.triggerTags) return 0;
  return q.triggerTags.reduce((sum, t) => sum + (signals.needWeights.get(t) ?? 0), 0);
}

/**
 * Choose the single most useful next question given everything answered so far.
 * Order: seeds → up to 2 best-matching cluster questions → practical → characteristics.
 */
export function selectNextQuestion(answers: Answer[]): BankQuestion | null {
  const asked = new Set(answers.map((a) => a.questionId));

  // 1. Seeds, in priority order.
  for (const seed of SEEDS) {
    if (!asked.has(seed.id)) return seed;
  }

  const signals = collectSignals(answers);

  // 2. Adaptive cluster-deepening: pick highest-scoring unasked question.
  const adaptiveAsked = ADAPTIVE.filter((q) => asked.has(q.id)).length;
  if (adaptiveAsked < MAX_ADAPTIVE) {
    const ranked = ADAPTIVE.filter((q) => !asked.has(q.id))
      .map((q) => ({ q, score: adaptiveScore(q, signals) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || b.q.priority - a.q.priority);
    if (ranked.length > 0) return ranked[0].q;
  }

  // 3. Practical — skipped if format was already captured by the hard filter.
  if (!asked.has(PRACTICAL.id) && !asked.has("filter-format")) return PRACTICAL;

  // 4. Closing characteristics question.
  if (!asked.has(CHARACTERISTICS.id)) return CHARACTERISTICS;

  return null;
}

/** Expected number of questions in this run, for the progress indicator. */
export function expectedTotal(answers: Answer[]): number {
  const signals = collectSignals(answers);
  const clusters = new Set<string>();
  for (const tag of signals.needWeights.keys()) clusters.add(CLUSTER_OF[tag]);
  const adaptiveExpected = Math.min(MAX_ADAPTIVE, Math.max(1, clusters.size));
  // seeds (2) + adaptive + practical (1) + characteristics (1)
  return SEEDS.length + adaptiveExpected + 2;
}

// ── Needs profile ─────────────────────────────────────────────────────────────
function sortedTags(signals: Signals): NeedTag[] {
  return [...signals.needWeights.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
}

export function buildProfile(answers: Answer[], signals = collectSignals(answers)): NeedsProfile {
  const tags = sortedTags(signals);

  // Presenting themes = distinct clusters, ordered by accumulated weight.
  const clusterWeight = new Map<string, number>();
  for (const [tag, w] of signals.needWeights) {
    const c = CLUSTER_OF[tag];
    clusterWeight.set(c, (clusterWeight.get(c) ?? 0) + w);
  }
  const presentingThemes = [...clusterWeight.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([c]) => SPECIALISM_THEME[c as keyof typeof SPECIALISM_THEME])
    .filter(Boolean)
    .slice(0, 3);

  // Specific needs: idiosyncratic chip labels (excluding style/practical), plus
  // the person's own free-text from the opening + deepening answers.
  const specificNeeds: SpecificNeed[] = [];
  const seenNeed = new Set<string>();
  for (const a of answers) {
    if (a.questionId === "characteristics" || a.questionId === "practical-format") continue;
    for (const chip of a.selectedChips) {
      if (!chip.needTags?.length) continue;
      if (seenNeed.has(chip.label)) continue;
      seenNeed.add(chip.label);
      specificNeeds.push({ text: chip.label, tags: chip.needTags });
    }
  }

  // Desired coach characteristics + working-style prefs from the closing question.
  const charAnswer = answers.find((a) => a.questionId === "characteristics");
  const desiredCoachCharacteristics = charAnswer
    ? charAnswer.selectedChips.map((c) => c.label)
    : [];
  const workingStylePrefs = [...signals.styles.keys()];

  // Urgency: high if strong burnout/stress signal, else gemiddeld.
  const stressWeight =
    (signals.needWeights.get("stress-burnout") ?? 0) +
    (signals.needWeights.get("energieherstel") ?? 0);
  const urgency: Urgency = stressWeight >= 3 ? "hoog" : stressWeight >= 1 ? "gemiddeld" : "laag";

  const f = extractFilters(answers);
  void tags;
  return {
    presentingThemes,
    specificNeeds,
    desiredCoachCharacteristics,
    workingStylePrefs,
    practicalConstraints: {
      language: f.language === "geen-voorkeur" ? "nl" : f.language,
      region: f.city ?? "Nederland",
      format: signals.format,
    },
    urgency,
  };
}

// ── Coach scoring ─────────────────────────────────────────────────────────────
export interface ScoredCoach {
  coach: Coach;
  fitScore: number;
  needsScore: number;
  styleScore: number;
  sectorScore: number;
  practicalScore: number;
  /** Tags both wanted and offered, strongest first. */
  matchedTags: NeedTag[];
}

const W_NEEDS = 0.58;
const W_STYLE = 0.2;
const W_SECTOR = 0.12;
const W_PRACTICAL = 0.1;

function scoreCoach(coach: Coach, signals: Signals): ScoredCoach {
  const compWeight = new Map<NeedTag, number>(coach.competencies.map((c) => [c.tag, c.weight]));

  // Needs dimension: intake weight × coach competency weight, normalised by the
  // best a coach could theoretically do for this intake.
  let needsRaw = 0;
  let needsMax = 0;
  const matched: { tag: NeedTag; strength: number }[] = [];
  for (const [tag, intakeW] of signals.needWeights) {
    needsMax += intakeW * MAX_TAG_WEIGHT;
    const cw = compWeight.get(tag);
    if (cw) {
      needsRaw += intakeW * cw;
      matched.push({ tag, strength: intakeW * cw });
    }
  }
  const needsScore = needsMax > 0 ? Math.round((needsRaw / needsMax) * 100) : 50;
  const matchedTags = matched.sort((a, b) => b.strength - a.strength).map((m) => m.tag);

  // Style dimension: share of desired styles the coach embodies (+ floor).
  const styleKeys = [...signals.styles.keys()];
  let styleScore = 70;
  if (styleKeys.length > 0) {
    const hits = styleKeys.filter((s) => coach.workingStyle.includes(s)).length;
    styleScore = Math.round(45 + (hits / styleKeys.length) * 55);
  }

  // Sector dimension: does the coach know this context?
  let sectorScore = 70;
  if (signals.sectors.size > 0) {
    const hits = [...signals.sectors].filter((s) => coach.sectorExperience.includes(s)).length;
    sectorScore = hits > 0 ? Math.round(80 + (hits / signals.sectors.size) * 20) : 55;
  }

  // Practical dimension: language + format. Coaches all work nl + every format here,
  // so this is a high-floor dimension that rarely separates candidates.
  const practicalScore = coach.languages.includes("nl") ? 95 : 70;

  const fitScore = Math.round(
    needsScore * W_NEEDS +
      styleScore * W_STYLE +
      sectorScore * W_SECTOR +
      practicalScore * W_PRACTICAL,
  );

  return { coach, fitScore, needsScore, styleScore, sectorScore, practicalScore, matchedTags };
}

export function rankCoaches(signals: Signals, pool: Coach[] = COACHES): ScoredCoach[] {
  return pool.map((c) => scoreCoach(c, signals)).sort((a, b) => {
    if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;
    // Tie-break: prefer the coach with the stronger pure-needs fit.
    return b.needsScore - a.needsScore;
  });
}

// ── Reasoning composition (idiosyncratic-fit framed) ──────────────────────────
function joinNl(parts: string[]): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} en ${parts[parts.length - 1]}`;
}

function buildMatch(scored: ScoredCoach[], signals: Signals): Match {
  const winner = scored[0];
  const runnerUp = scored[1] ?? scored[0];
  const coach = winner.coach;

  const topTags = winner.matchedTags.slice(0, 3);
  const needPhrases = topTags.map((t) => NEED_PHRASE[t]);
  const strengthPhrases = topTags.map((t) => STRENGTH_PHRASE[t]);

  const evidence = topTags.map((t) => ({
    need: NEED_PHRASE[t],
    coachStrength: STRENGTH_PHRASE[t],
  }));

  // Style overlap, mentioned only if present.
  const desiredStyles = [...signals.styles.keys()];
  const sharedStyles = desiredStyles.filter((s) => coach.workingStyle.includes(s));

  const sentences: string[] = [];
  if (needPhrases.length > 0) {
    sentences.push(
      `Voor jou draait het vooral om ${joinNl(needPhrases)}.`,
    );
    sentences.push(
      `${coach.name} is daar juist sterk in — met aantoonbare ervaring in ${joinNl(strengthPhrases)}.`,
    );
  } else {
    sentences.push(
      `${coach.name} sluit het best aan bij wat je beschreef.`,
    );
  }
  if (sharedStyles.length > 0) {
    sentences.push(
      `De werkwijze past ook: je zocht een ${joinNl(sharedStyles)} coach, en zo werkt ${coach.name.split(" ")[0]}.`,
    );
  }
  sentences.push(
    `De match is gemaakt op jouw concrete behoeften en ${coach.name.split(" ")[0]}'s werkelijke expertise — niet op een persoonlijkheidstype of op 'klikken'.`,
  );

  const fitBreakdown = [
    {
      dimension: "Behoefte ↔ expertise",
      score: winner.needsScore,
      note:
        strengthPhrases.length > 0
          ? `Sluit aan op ${joinNl(strengthPhrases)}.`
          : "Brede aansluiting op je situatie.",
    },
    {
      dimension: "Werkwijze & stijl",
      score: winner.styleScore,
      note:
        sharedStyles.length > 0
          ? `Werkt ${joinNl(sharedStyles)}, zoals jij zocht.`
          : `Werkwijze: ${joinNl(coach.workingStyle)}.`,
    },
    {
      dimension: "Context & sector",
      score: winner.sectorScore,
      note:
        signals.sectors.size > 0
          ? `Ervaring in ${joinNl([...signals.sectors])}.`
          : `Ervaring in ${joinNl(coach.sectorExperience.slice(0, 3))}.`,
    },
    {
      dimension: "Praktisch",
      score: winner.practicalScore,
      note: `Coacht in het Nederlands${
        signals.format !== "geen-voorkeur" ? ` · ${signals.format}` : ""
      }.`,
    },
  ];

  const runnerReason =
    runnerUp.coach.specialisms.includes("generalist")
      ? `${runnerUp.coach.name} is een brede, ervaren sparringpartner — een veilige tweede keuze als je meerdere dingen wilt verkennen.`
      : `${runnerUp.coach.name} is een sterke tweede optie, met overlap op een deel van je behoeften.`;

  return {
    coachId: coach.id,
    fitScore: winner.fitScore,
    reasoning: sentences.join(" "),
    evidence,
    fitBreakdown,
    runnerUpId: runnerUp.coach.id,
    runnerUpReason: runnerReason,
  };
}

// ── Public entry points ───────────────────────────────────────────────────────
export interface FallbackMatchResult {
  profile: NeedsProfile;
  match: Match;
  coach: Coach;
  runnerUp: Coach;
}

export function runFallbackMatch(answers: Answer[], pool: Coach[] = COACHES): FallbackMatchResult {
  const signals = collectSignals(answers);
  const profile = buildProfile(answers, signals);
  const scored = rankCoaches(signals, pool);
  const match = buildMatch(scored, signals);
  return {
    profile,
    match,
    coach: getCoach(match.coachId)!,
    runnerUp: getCoach(match.runnerUpId)!,
  };
}

/** Used by the API fallback path to hand the client the next bank question. */
export function nextQuestionFallback(answers: Answer[]) {
  const bankQ = selectNextQuestion(answers);
  return {
    done: bankQ === null,
    question: bankQ ? toQuestion(bankQ) : null,
    expectedTotal: expectedTotal(answers),
  };
}

export { QUESTION_BANK_BY_ID };
