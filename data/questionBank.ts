import type { Question, NeedTag } from "@/lib/types";

/**
 * Fallback question bank for Demo/Scripted mode and graceful degradation.
 *
 * The deterministic engine (lib/fallback.ts) walks this bank:
 *   1. ask the seed questions,
 *   2. then ask the cluster-deepening question whose trigger tags best match
 *      what's been answered so far (this is the "adaptive branch"),
 *   3. then a quick practical question,
 *   4. then close with "what do you want in a coach".
 *
 * Chips carry the tags they contribute, so the whole flow is tappable and
 * scores deterministically with zero API calls.
 */
export interface BankQuestion extends Question {
  stage: "seed" | "adaptive" | "practical" | "characteristics";
  /** For adaptive questions: surfaced when these tags have accumulated. */
  triggerTags?: NeedTag[];
  /** Higher wins when multiple are eligible. */
  priority: number;
}

export const QUESTION_BANK: BankQuestion[] = [
  // ── Seed questions ─────────────────────────────────────────────────────────
  {
    id: "seed-aanleiding",
    stage: "seed",
    priority: 100,
    kind: "open",
    allowCustom: true,
    dimensionProbed: "Aanleiding",
    prompt: "Wat speelt er op dit moment waardoor je aan coaching denkt?",
    helper: "Vertel het in je eigen woorden, of tik een herkenbaar punt aan.",
    chips: [
      { label: "Ik loop op mijn tandvlees", needTags: ["stress-burnout", "energieherstel"] },
      { label: "Net leidinggevende geworden", needTags: ["eerste-leidinggevende", "rolverandering"] },
      { label: "Ik twijfel over mijn loopbaan", needTags: ["loopbaankeuze", "heroriëntatie"] },
      { label: "Ik voel me vaak onzeker", needTags: ["zelfvertrouwen", "imposter"] },
      { label: "Veel druk en grote beslissingen", needTags: ["hoge-druk-executive", "besluitvorming"] },
      { label: "Ik kom moeilijk voor mezelf op", needTags: ["communicatie-assertiviteit", "grenzen-stellen"] },
    ],
  },
  {
    id: "seed-context",
    stage: "seed",
    priority: 90,
    kind: "single",
    allowCustom: true,
    dimensionProbed: "Context & sector",
    prompt: "In wat voor omgeving speelt dit zich vooral af?",
    helper: "Dit helpt om de context van je werk mee te wegen.",
    chips: [
      { label: "Finance / Zuidas", sectors: ["finance"], needTags: ["hoge-druk-executive"] },
      { label: "Consultancy", sectors: ["consultancy"] },
      { label: "Tech / scale-up", sectors: ["tech"] },
      { label: "Zorg", sectors: ["zorg"] },
      { label: "Publieke sector", sectors: ["publiek"] },
      { label: "Onderwijs", sectors: ["onderwijs"] },
      { label: "Creatieve sector", sectors: ["creatief"] },
    ],
  },

  // ── Adaptive cluster-deepening questions ─────────────────────────────────────
  {
    id: "deep-stress",
    stage: "adaptive",
    priority: 50,
    triggerTags: ["stress-burnout", "energieherstel", "werk-prive-balans", "perfectionisme", "grenzen-stellen"],
    kind: "multi",
    allowCustom: true,
    dimensionProbed: "Specifieke behoefte",
    prompt: "Het kost je veel energie. Waar zit voor jou de kern?",
    helper: "Kies wat het meest klopt — meerdere mag.",
    chips: [
      { label: "Weer kunnen ontspannen", needTags: ["energieherstel"] },
      { label: "Grenzen leren stellen", needTags: ["grenzen-stellen"] },
      { label: "Minder streng voor mezelf", needTags: ["perfectionisme"] },
      { label: "Werk en privé in balans", needTags: ["werk-prive-balans"] },
      { label: "Voorkomen dat ik omval", needTags: ["stress-burnout"] },
    ],
  },
  {
    id: "deep-leadership",
    stage: "adaptive",
    priority: 50,
    triggerTags: ["eerste-leidinggevende", "rolverandering", "delegeren", "feedback-geven"],
    kind: "multi",
    allowCustom: true,
    dimensionProbed: "Specifieke behoefte",
    prompt: "Wat is in je nieuwe rol op dit moment het lastigst?",
    helper: "Kies wat het meest speelt.",
    chips: [
      { label: "Loslaten en delegeren", needTags: ["delegeren"] },
      { label: "Feedback durven geven", needTags: ["feedback-geven"] },
      { label: "Wennen aan de nieuwe rol", needTags: ["rolverandering"] },
      { label: "Knopen leren doorhakken", needTags: ["besluitvorming"] },
      { label: "Stevig staan als leider", needTags: ["eerste-leidinggevende"] },
    ],
  },
  {
    id: "deep-career",
    stage: "adaptive",
    priority: 50,
    triggerTags: ["loopbaankeuze", "heroriëntatie", "zingeving-identiteit"],
    kind: "multi",
    allowCustom: true,
    dimensionProbed: "Specifieke behoefte",
    prompt: "Wat maakt de keuze over je loopbaan nu lastig?",
    helper: "Kies wat het dichtst bij ligt.",
    chips: [
      { label: "Ik weet niet wat ik wil", needTags: ["loopbaankeuze"] },
      { label: "Ik mis betekenis in mijn werk", needTags: ["zingeving-identiteit"] },
      { label: "Ik ben toe aan iets heel anders", needTags: ["heroriëntatie"] },
      { label: "Ik durf de stap niet te maken", needTags: ["zelfvertrouwen"] },
    ],
  },
  {
    id: "deep-confidence",
    stage: "adaptive",
    priority: 50,
    triggerTags: ["zelfvertrouwen", "imposter", "zichtbaarheid"],
    kind: "multi",
    allowCustom: true,
    dimensionProbed: "Specifieke behoefte",
    prompt: "Hoe merk je die onzekerheid het sterkst?",
    helper: "Kies wat herkenbaar is.",
    chips: [
      { label: "Ik voel me een bedrieger", needTags: ["imposter"] },
      { label: "Ik cijfer mezelf weg", needTags: ["zichtbaarheid"] },
      { label: "Ik durf niet te laten zien wat ik kan", needTags: ["zichtbaarheid"] },
      { label: "Ik twijfel aan elke beslissing", needTags: ["zelfvertrouwen"] },
      { label: "Het moet altijd perfect", needTags: ["perfectionisme"] },
    ],
  },
  {
    id: "deep-exec",
    stage: "adaptive",
    priority: 55,
    triggerTags: ["hoge-druk-executive", "besluitvorming", "strategische-eenzaamheid"],
    kind: "multi",
    allowCustom: true,
    dimensionProbed: "Specifieke behoefte",
    prompt: "Onder die druk — wat heb je dan het meest nodig?",
    helper: "Kies wat het zwaarst weegt.",
    chips: [
      { label: "Scherp blijven beslissen", needTags: ["besluitvorming"] },
      { label: "Iemand om vertrouwelijk mee te sparren", needTags: ["strategische-eenzaamheid"] },
      { label: "De druk beter hanteren", needTags: ["hoge-druk-executive", "grenzen-stellen"] },
      { label: "Rust in mijn hoofd", needTags: ["energieherstel"] },
    ],
  },
  {
    id: "deep-communication",
    stage: "adaptive",
    priority: 50,
    triggerTags: ["communicatie-assertiviteit", "conflicthantering", "presentie-overtuigingskracht"],
    kind: "multi",
    allowCustom: true,
    dimensionProbed: "Specifieke behoefte",
    prompt: "Waar loopt de communicatie voor jou het vaakst spaak?",
    helper: "Kies de situaties die je herkent.",
    chips: [
      { label: "Ik vind het moeilijk nee te zeggen", needTags: ["communicatie-assertiviteit", "grenzen-stellen"] },
      { label: "Ik ga conflicten uit de weg", needTags: ["conflicthantering"] },
      { label: "Ik heb te weinig impact in overleg", needTags: ["presentie-overtuigingskracht"] },
      { label: "Lastige gesprekken aangaan", needTags: ["conflicthantering"] },
    ],
  },

  // ── Practical ────────────────────────────────────────────────────────────────
  {
    id: "practical-format",
    stage: "practical",
    priority: 30,
    kind: "single",
    allowCustom: false,
    dimensionProbed: "Praktisch",
    prompt: "Hoe zou je het liefst willen coachen?",
    helper: "Puur praktisch — dit weegt licht mee in de match.",
    chips: [
      { label: "Online", sectors: [] },
      { label: "In persoon", sectors: [] },
      { label: "Hybride", sectors: [] },
      { label: "Maakt me niet uit", sectors: [] },
    ],
  },

  // ── Closing: desired coach characteristics (the Kees question) ────────────────
  {
    id: "characteristics",
    stage: "characteristics",
    priority: 10,
    kind: "multi",
    allowCustom: true,
    dimensionProbed: "Gewenste coach-eigenschappen",
    prompt: "Noem een paar dingen die je vooral zoekt in een coach.",
    helper: "Kies er gerust drie — dit kleurt de match.",
    chips: [
      { label: "Direct en to-the-point", styleTags: ["directief"] },
      { label: "Warm en begripvol", styleTags: ["warm"] },
      { label: "Structuur en houvast", styleTags: ["gestructureerd"] },
      { label: "Ruimte om te verkennen", styleTags: ["verkennend"] },
      { label: "Praktisch en concreet", styleTags: ["pragmatisch"] },
      { label: "Rustig en reflectief", styleTags: ["reflectief"] },
    ],
  },
];

export const QUESTION_BANK_BY_ID: Record<string, BankQuestion> = Object.fromEntries(
  QUESTION_BANK.map((q) => [q.id, q]),
);

/** Strip the bank-only selection metadata down to a plain Question for the client. */
export function toQuestion(q: BankQuestion): Question {
  const { stage: _stage, triggerTags: _triggerTags, priority: _priority, ...rest } = q;
  void _stage;
  void _triggerTags;
  void _priority;
  return rest;
}
