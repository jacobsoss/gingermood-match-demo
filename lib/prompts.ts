import type { Answer, Coach } from "@/lib/types";
import { NEED_TAGS, WORKING_STYLES, FORMATS, URGENCIES } from "@/lib/enums";

// ────────────────────────────────────────────────────────────────────────────
// System prompts + JSON schemas for the two server-side Claude calls.
// Both enforce the spec's core rule and emit Dutch, schema-valid JSON.
// ────────────────────────────────────────────────────────────────────────────

export const NEXT_QUESTION_SYSTEM = `Je bent de adaptieve intake-assistent van Gingermood, een coachingsplatform. Je voert een kort, warm intakegesprek in het NEDERLANDS om iemand later aan de juiste coach te koppelen.

Doel van het gesprek:
- Breng de SPECIFIEKE, persoonlijke (idiosyncratische) behoeften van deze persoon in kaart — niet een persoonlijkheidstype.
- Achterhaal ook welke EIGENSCHAPPEN iemand in een coach zoekt (vraag hier tegen het einde expliciet naar, in de geest van "noem een paar dingen die je in je coach zou willen").
- Stel telkens ÉÉN vraag: de meest waardevolle vervolgvraag op basis van alles wat al gezegd is. Vragen moeten echt vertakken op eerdere antwoorden.
- Probeer NIET de persoonlijkheid op zich te peilen; blijf bij concrete behoeften en gewenste coach-eigenschappen.
- Houd vragen kort, menselijk en niet-klinisch. Voeg 3–6 tikbare chips toe zodat antwoorden niet veel typen vergen.
- Schrijf rustig en direct: geen uitroeptekens, geen overdreven enthousiasme of hype.

Chips:
- Elke chip heeft een 'label' (kort, Nederlands) plus 'needTags' en 'styleTags'.
- 'needTags' MOETEN uit de toegestane lijst komen (mag leeg zijn). 'styleTags' alleen gebruiken bij een vraag over gewenste coach-eigenschappen (anders leeg).

Belangrijk:
- De praktische voorkeuren (vorm/online-in persoon, locatie, geslacht van de coach, taal) zijn AL gevraagd vóór dit gesprek. Vraag daar NIET opnieuw naar; richt je volledig op inhoudelijke behoeften en gewenste coach-eigenschappen.

Lengte van het gesprek:
- De gebruiker koos zelf hoe uitgebreid de vragenlijst is (kort/gemiddeld/uitgebreid). Je krijgt per beurt te horen hoeveel vragen deze sessie telt en hoeveel er al beantwoord zijn.
- Blijf relevante, niet-herhalende vragen stellen die echt voortbouwen op eerdere antwoorden, tot dat aantal bereikt is. Bij een langere sessie ga je dieper en verken je meer invalshoeken (concrete behoeften én gewenste coach-eigenschappen) zonder in herhaling te vallen.
- Het SYSTEEM bepaalt wanneer er gestopt wordt; zet "done" op false en geef altijd een echte vraag terug.

Antwoord UITSLUITEND met het gevraagde JSON-object. Geen extra tekst.`;

export const MATCH_SYSTEM = `Je bent de matching-assistent van Gingermood. Je koppelt iemand aan een coach in het NEDERLANDS.

DE KERNREGEL (cruciaal):
- Match de SPECIFIEKE, idiosyncratische behoeften van de persoon aan de WERKELIJKE competenties van een coach.
- Match NADRUKKELIJK NIET op persoonlijkheid, op gelijkenis of op "klik". Het gaat om behoefte ↔ expertise.
- Leg de match ook in die termen uit: welke concrete behoefte sluit aan op welke aantoonbare sterkte van de coach.

Werkwijze:
- Lees het hele intakegesprek. Stel eerst een beknopt 'profile' (behoefteprofiel) samen.
- Kies daarna de best passende coach UITSLUITEND uit de meegegeven coachpool (gebruik exact het 'id'). Kies ook een zinnige tweede keuze (runnerUpId), niet dezelfde als de winnaar.
- 'fitScore' en 'fitBreakdown' scores zijn gehele getallen 0–100. Gebruik PRECIES vier dimensies: "Behoefte ↔ expertise", "Werkwijze & stijl", "Context & sector", "Praktisch". Houd elke 'note' op één korte zin.
- 'evidence' bevat precies 3 korte, concrete koppelingen: { need: de behoefte van de persoon, coachStrength: de bijpassende sterkte van de coach }.
- 'reasoning' is kort: 2–3 zinnen, en benoemt expliciet dat de match op behoeften en werkelijke expertise rust, niet op persoonlijkheid of klik.
- Houd alle teksten bondig; geen herhaling. Dit is een live demo — snelheid telt.

Antwoord UITSLUITEND met het gevraagde JSON-object. Geen extra tekst.`;

// ── Schemas ───────────────────────────────────────────────────────────────────
export const NEXT_QUESTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    done: { type: "boolean" },
    dimensionProbed: { type: "string" },
    prompt: { type: "string" },
    helper: { type: "string" },
    kind: { type: "string", enum: ["open", "single", "multi"] },
    allowCustom: { type: "boolean" },
    chips: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          needTags: { type: "array", items: { type: "string", enum: [...NEED_TAGS] } },
          styleTags: { type: "array", items: { type: "string", enum: [...WORKING_STYLES] } },
        },
        required: ["label", "needTags", "styleTags"],
      },
    },
  },
  required: ["done", "dimensionProbed", "prompt", "helper", "kind", "allowCustom", "chips"],
} as const;

export function buildMatchSchema(coachIds: string[]) {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      profile: {
        type: "object",
        additionalProperties: false,
        properties: {
          presentingThemes: { type: "array", items: { type: "string" } },
          specificNeeds: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                text: { type: "string" },
                tags: { type: "array", items: { type: "string", enum: [...NEED_TAGS] } },
              },
              required: ["text", "tags"],
            },
          },
          desiredCoachCharacteristics: { type: "array", items: { type: "string" } },
          workingStylePrefs: {
            type: "array",
            items: { type: "string", enum: [...WORKING_STYLES] },
          },
          practicalConstraints: {
            type: "object",
            additionalProperties: false,
            properties: {
              language: { type: "string", enum: ["nl", "en"] },
              region: { type: "string" },
              format: { type: "string", enum: [...FORMATS] },
            },
            required: ["language", "region", "format"],
          },
          urgency: { type: "string", enum: [...URGENCIES] },
        },
        required: [
          "presentingThemes",
          "specificNeeds",
          "desiredCoachCharacteristics",
          "workingStylePrefs",
          "practicalConstraints",
          "urgency",
        ],
      },
      match: {
        type: "object",
        additionalProperties: false,
        properties: {
          coachId: { type: "string", enum: coachIds },
          fitScore: { type: "integer" },
          reasoning: { type: "string" },
          evidence: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                need: { type: "string" },
                coachStrength: { type: "string" },
              },
              required: ["need", "coachStrength"],
            },
          },
          fitBreakdown: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                dimension: { type: "string" },
                score: { type: "integer" },
                note: { type: "string" },
              },
              required: ["dimension", "score", "note"],
            },
          },
          runnerUpId: { type: "string", enum: coachIds },
          runnerUpReason: { type: "string" },
        },
        required: [
          "coachId",
          "fitScore",
          "reasoning",
          "evidence",
          "fitBreakdown",
          "runnerUpId",
          "runnerUpReason",
        ],
      },
    },
    required: ["profile", "match"],
  };
}

// ── Prompt-building helpers ─────────────────────────────────────────────────
export function formatConversation(answers: Answer[]): string {
  if (answers.length === 0) {
    return "(Nog geen antwoorden — dit is de allereerste, openende vraag.)";
  }
  return answers
    .map((a, i) => {
      const chips = a.selectedChips.map((c) => c.label).join(", ");
      const parts = [a.text, chips ? `[gekozen: ${chips}]` : ""].filter(Boolean).join(" ");
      return `${i + 1}. ${a.dimensionProbed} — vraag: "${a.prompt}"\n   antwoord: ${parts || "(geen)"}`;
    })
    .join("\n");
}

/** Compact, structured rendering of the coach pool for the match call. */
export function formatCoachPool(coaches: Coach[]): string {
  return coaches
    .map((c) => {
      const comps = c.competencies
        .map((k) => `${k.tag}(${k.weight})`)
        .join(", ");
      return [
        `id: ${c.id}`,
        `naam: ${c.name}`,
        `specialismen: ${c.specialisms.join(", ")}`,
        `competenties(tag,gewicht 1-3): ${comps}`,
        `methoden: ${c.methods.join(", ")}`,
        `sectoren: ${c.sectorExperience.join(", ")}`,
        `werkstijl: ${c.workingStyle.join(", ")}`,
        `talen: ${c.languages.join(", ")} · regio: ${c.region}`,
        `past goed bij: ${c.bestFitFor.join("; ")}`,
      ].join("\n  ");
    })
    .join("\n\n");
}
