import { NextResponse } from "next/server";
import type {
  Chip,
  NextQuestionRequest,
  NextQuestionResponse,
  Question,
  QuestionKind,
} from "@/lib/types";
import { MODEL, extractJson, getAnthropic, responseText } from "@/lib/anthropicClient";
import { NEXT_QUESTION_SCHEMA, NEXT_QUESTION_SYSTEM, formatConversation } from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bound the intake: never fewer than this before we allow "done", never more.
const MIN_QUESTIONS = 4;
const MAX_QUESTIONS = 6;

interface NextQuestionAI {
  done: boolean;
  dimensionProbed: string;
  prompt: string;
  helper: string;
  kind: QuestionKind;
  allowCustom: boolean;
  chips: Chip[];
}

export async function POST(req: Request): Promise<Response> {
  let body: NextQuestionRequest;
  try {
    body = (await req.json()) as NextQuestionRequest;
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const answers = body.answers ?? [];
  // Count only curated answers — the up-front hard-filter answers don't count
  // toward the adaptive question budget.
  const answered = answers.filter((a) => !a.questionId.startsWith("filter-")).length;

  // Hard upper bound — stop the intake without another model call.
  if (answered >= MAX_QUESTIONS) {
    return NextResponse.json({
      done: true,
      question: null,
      expectedTotal: answered,
      source: "ai",
    } satisfies NextQuestionResponse);
  }

  try {
    const client = getAnthropic();
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      temperature: 0.3,
      thinking: { type: "disabled" },
      system: NEXT_QUESTION_SYSTEM,
      messages: [
        {
          role: "user",
          content:
            `Gesprek tot nu toe (${answered} vragen beantwoord):\n` +
            `${formatConversation(answers)}\n\n` +
            `Genereer de volgende, meest waardevolle vraag — of zet done=true als je genoeg signaal hebt.`,
        },
      ],
      output_config: {
        format: { type: "json_schema", schema: NEXT_QUESTION_SCHEMA },
      },
    });

    const parsed = extractJson<NextQuestionAI>(responseText(message));

    // Apply bounds: don't let the model stop too early.
    const done = parsed.done && answered >= MIN_QUESTIONS;

    if (done) {
      return NextResponse.json({
        done: true,
        question: null,
        expectedTotal: answered,
        source: "ai",
      } satisfies NextQuestionResponse);
    }

    const question: Question = {
      id: `ai-q${answered + 1}`,
      prompt: parsed.prompt,
      helper: parsed.helper || undefined,
      dimensionProbed: parsed.dimensionProbed || "Behoefte",
      chips: (parsed.chips ?? []).map((c) => ({
        label: c.label,
        needTags: c.needTags ?? [],
        styleTags: c.styleTags ?? [],
      })),
      kind: parsed.kind ?? "open",
      allowCustom: parsed.allowCustom ?? true,
    };

    return NextResponse.json({
      done: false,
      question,
      expectedTotal: Math.min(MAX_QUESTIONS, Math.max(5, answered + 2)),
      source: "ai",
    } satisfies NextQuestionResponse);
  } catch (err) {
    console.error("next-question AI error:", err);
    // Surface failure so the client can retry once, then fall back deterministically.
    return NextResponse.json({ error: "AI niet beschikbaar." }, { status: 502 });
  }
}
