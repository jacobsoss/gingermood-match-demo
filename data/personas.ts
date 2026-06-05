import type { Persona } from "@/lib/types";

/**
 * SYNTHETIC sample personas — pre-filled coachees so the demo runs instantly
 * and shows contrasting matches without typing. No real records.
 *
 * Each persona's chip tags point cleanly at one intended coach, so the
 * deterministic matcher (and the AI) reliably produce a strong, differentiated
 * result. (Sanity-checked in lib/fallback.ts via assertPersonaMatches in dev.)
 */
export const PERSONAS: Persona[] = [
  {
    id: "opgebrande-consultant",
    label: "Opgebrande consultant",
    blurb: "Maanden 'aan' gestaan, kan thuis niet meer uitschakelen.",
    initials: "OC",
    accent: "terracotta",
    intendedCoachId: "mara-de-wit",
    answers: [
      {
        questionId: "seed-aanleiding",
        prompt: "Wat speelt er op dit moment waardoor je aan coaching denkt?",
        dimensionProbed: "Aanleiding",
        text: "Ik draai al maanden overuren bij de klant en sta continu 'aan'. Thuis lukt het me niet meer om te ontspannen en ik ben kort voor mijn gevoel echt op.",
        selectedChips: [
          { label: "Ik loop op mijn tandvlees", needTags: ["stress-burnout", "energieherstel"] },
        ],
      },
      {
        questionId: "seed-context",
        prompt: "In wat voor omgeving speelt dit zich vooral af?",
        dimensionProbed: "Context & sector",
        text: "",
        selectedChips: [{ label: "Consultancy", sectors: ["consultancy"] }],
      },
      {
        questionId: "deep-stress",
        prompt: "Het kost je veel energie. Waar zit voor jou de kern?",
        dimensionProbed: "Specifieke behoefte",
        text: "Ik wil weer kunnen ontspannen en leren om op tijd nee te zeggen.",
        selectedChips: [
          { label: "Weer kunnen ontspannen", needTags: ["energieherstel"] },
          { label: "Grenzen leren stellen", needTags: ["grenzen-stellen"] },
          { label: "Minder streng voor mezelf", needTags: ["perfectionisme"] },
        ],
      },
      {
        questionId: "practical-format",
        prompt: "Hoe zou je het liefst willen coachen?",
        dimensionProbed: "Praktisch",
        text: "",
        selectedChips: [{ label: "Online" }],
      },
      {
        questionId: "characteristics",
        prompt: "Noem een paar dingen die je vooral zoekt in een coach.",
        dimensionProbed: "Gewenste coach-eigenschappen",
        text: "Iemand die rust uitstraalt en niet meteen oordeelt.",
        selectedChips: [
          { label: "Warm en begripvol", styleTags: ["warm"] },
          { label: "Rustig en reflectief", styleTags: ["reflectief"] },
        ],
      },
    ],
  },
  {
    id: "nieuwe-manager",
    label: "Net benoemde manager",
    blurb: "Werd teamlead van het eigen oude team — schakelen valt zwaar.",
    initials: "NM",
    accent: "sage",
    intendedCoachId: "joost-bremer",
    answers: [
      {
        questionId: "seed-aanleiding",
        prompt: "Wat speelt er op dit moment waardoor je aan coaching denkt?",
        dimensionProbed: "Aanleiding",
        text: "Drie maanden geleden werd ik teamlead van mijn eigen oude team. Ik vind het lastig om te schakelen van zelf meedoen naar sturen en loslaten.",
        selectedChips: [
          { label: "Net leidinggevende geworden", needTags: ["eerste-leidinggevende", "rolverandering"] },
        ],
      },
      {
        questionId: "seed-context",
        prompt: "In wat voor omgeving speelt dit zich vooral af?",
        dimensionProbed: "Context & sector",
        text: "",
        selectedChips: [{ label: "Tech / scale-up", sectors: ["tech"] }],
      },
      {
        questionId: "deep-leadership",
        prompt: "Wat is in je nieuwe rol op dit moment het lastigst?",
        dimensionProbed: "Specifieke behoefte",
        text: "Vooral het loslaten: ik pak nog te veel zelf op en vind het spannend om mensen aan te spreken.",
        selectedChips: [
          { label: "Loslaten en delegeren", needTags: ["delegeren"] },
          { label: "Feedback durven geven", needTags: ["feedback-geven"] },
          { label: "Wennen aan de nieuwe rol", needTags: ["rolverandering"] },
        ],
      },
      {
        questionId: "practical-format",
        prompt: "Hoe zou je het liefst willen coachen?",
        dimensionProbed: "Praktisch",
        text: "",
        selectedChips: [{ label: "Hybride" }],
      },
      {
        questionId: "characteristics",
        prompt: "Noem een paar dingen die je vooral zoekt in een coach.",
        dimensionProbed: "Gewenste coach-eigenschappen",
        text: "Iemand die me concrete handvatten geeft en helder structuur biedt.",
        selectedChips: [
          { label: "Structuur en houvast", styleTags: ["gestructureerd"] },
          { label: "Praktisch en concreet", styleTags: ["pragmatisch"] },
          { label: "Direct en to-the-point", styleTags: ["directief"] },
        ],
      },
    ],
  },
  {
    id: "loopbaan-kruispunt",
    label: "Analist op een kruispunt",
    blurb: "Zeven jaar hetzelfde werk, steeds minder voldoening, geen richting.",
    initials: "AK",
    accent: "amber",
    intendedCoachId: "anouk-veenstra",
    answers: [
      {
        questionId: "seed-aanleiding",
        prompt: "Wat speelt er op dit moment waardoor je aan coaching denkt?",
        dimensionProbed: "Aanleiding",
        text: "Ik werk al zeven jaar als analist, maar voel steeds minder voldoening. Ik weet alleen niet goed wat dan wél bij me zou passen.",
        selectedChips: [
          { label: "Ik twijfel over mijn loopbaan", needTags: ["loopbaankeuze", "heroriëntatie"] },
        ],
      },
      {
        questionId: "seed-context",
        prompt: "In wat voor omgeving speelt dit zich vooral af?",
        dimensionProbed: "Context & sector",
        text: "",
        selectedChips: [{ label: "Consultancy", sectors: ["consultancy"] }],
      },
      {
        questionId: "deep-career",
        prompt: "Wat maakt de keuze over je loopbaan nu lastig?",
        dimensionProbed: "Specifieke behoefte",
        text: "Ik mis betekenis en heb het gevoel dat ik vastzit, maar durf nog niet te kiezen.",
        selectedChips: [
          { label: "Ik weet niet wat ik wil", needTags: ["loopbaankeuze"] },
          { label: "Ik mis betekenis in mijn werk", needTags: ["zingeving-identiteit"] },
          { label: "Ik ben toe aan iets heel anders", needTags: ["heroriëntatie"] },
        ],
      },
      {
        questionId: "practical-format",
        prompt: "Hoe zou je het liefst willen coachen?",
        dimensionProbed: "Praktisch",
        text: "",
        selectedChips: [{ label: "Online" }],
      },
      {
        questionId: "characteristics",
        prompt: "Noem een paar dingen die je vooral zoekt in een coach.",
        dimensionProbed: "Gewenste coach-eigenschappen",
        text: "Iemand die met me meedenkt en ruimte geeft om dingen te verkennen.",
        selectedChips: [
          { label: "Ruimte om te verkennen", styleTags: ["verkennend"] },
          { label: "Rustig en reflectief", styleTags: ["reflectief"] },
        ],
      },
    ],
  },
];

export const PERSONAS_BY_ID: Record<string, Persona> = Object.fromEntries(
  PERSONAS.map((p) => [p.id, p]),
);
