import { NextResponse } from "next/server";
import type { Match, MatchRequest, MatchResponse, NeedsProfile } from "@/lib/types";
import { COACHES, COACHES_BY_ID } from "@/data/coaches";
import { poolForFilters } from "@/lib/filters";
import { MODEL, extractJson, getAnthropic, responseText } from "@/lib/anthropicClient";
import { MATCH_SYSTEM, buildMatchSchema, formatCoachPool, formatConversation } from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MatchAI {
  profile: NeedsProfile;
  match: Match;
}

export async function POST(req: Request): Promise<Response> {
  let body: MatchRequest;
  try {
    body = (await req.json()) as MatchRequest;
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }

  const answers = body.answers ?? [];
  // Apply the hard up-front filters (gender/language/in-person range): the AI only
  // sees, and can only pick from, coaches that satisfy them. Relaxes to the full
  // pool if the constraints leave fewer than two coaches.
  const { pool } = body.filters ? poolForFilters(COACHES, body.filters) : { pool: COACHES };
  const coachIds = pool.map((c) => c.id);

  try {
    const client = getAnthropic();
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      temperature: 0.2,
      thinking: { type: "disabled" },
      system: MATCH_SYSTEM,
      messages: [
        {
          role: "user",
          content:
            `Intakegesprek:\n${formatConversation(answers)}\n\n` +
            `Coachpool (kies uitsluitend uit deze id's — al gefilterd op de harde voorkeuren):\n${formatCoachPool(pool)}\n\n` +
            `Stel het behoefteprofiel samen en kies de beste match volgens de kernregel (behoefte ↔ werkelijke expertise, niet persoonlijkheid).`,
        },
      ],
      output_config: {
        format: { type: "json_schema", schema: buildMatchSchema(coachIds) },
      },
    });

    const parsed = extractJson<MatchAI>(responseText(message));

    const coach = COACHES_BY_ID[parsed.match.coachId];
    if (!coach) throw new Error(`Onbekende coach-id: ${parsed.match.coachId}`);

    // Guard: runner-up must exist and differ from the winner.
    let runnerUp = COACHES_BY_ID[parsed.match.runnerUpId];
    if (!runnerUp || runnerUp.id === coach.id) {
      runnerUp =
        pool.find((c) => c.id !== coach.id && c.specialisms.includes("generalist")) ??
        pool.find((c) => c.id !== coach.id) ??
        coach;
      parsed.match.runnerUpId = runnerUp.id;
    }

    return NextResponse.json({
      profile: parsed.profile,
      match: parsed.match,
      coach,
      runnerUp,
      source: "ai",
    } satisfies MatchResponse);
  } catch (err) {
    console.error("match AI error:", err);
    return NextResponse.json({ error: "AI niet beschikbaar." }, { status: 502 });
  }
}
