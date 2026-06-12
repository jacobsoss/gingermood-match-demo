import type {
  Answer,
  Locale,
  NextQuestionResponse,
  MatchResponse,
} from "@/lib/types";
import { COACHES, getCoach } from "@/data/coaches";
import { nextQuestionFallback, runFallbackMatch } from "@/lib/fallback";
import { extractFilters, intakeCount, poolForFilters } from "@/lib/filters";

/**
 * Client-side engine facade. The app runs in Live AI only.
 *
 * Every step calls the server route with one silent retry; on any error/timeout
 * it degrades to the deterministic engine so the flow never breaks. The fallback
 * is invisible resilience, not a user-selectable mode.
 */
const LOCALE: Locale = "nl";
// Live AI calls (esp. the match) can take ~15–20s; allow headroom before the
// silent retry / deterministic fallback kicks in.
const TIMEOUT_MS = 28000;

/**
 * Stage mode: presenter-controlled flag (Settings → "Stage mode") that forces
 * the deterministic engine — zero network calls during a live demo.
 */
function stageModeOn(): boolean {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem("gm-stage-mode") === "1";
  } catch {
    return false;
  }
}

/** Deterministic fallback — the silent safety net when the live API fails. */
function nextQuestionFallbackResponse(answers: Answer[]): NextQuestionResponse {
  return { ...nextQuestionFallback(answers), source: "fallback" };
}

function matchFallbackResponse(answers: Answer[]): MatchResponse {
  const { pool, rangeInfo } = poolForFilters(COACHES, extractFilters(answers));
  const { profile, match, coach, runnerUp } = runFallbackMatch(answers, pool);
  return { profile, match, coach, runnerUp, source: "fallback", rangeInfo };
}

/** POST with a timeout and one silent retry. Throws if both attempts fail. */
async function postWithRetry<T>(url: string, body: unknown): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as T;
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("Request failed");
}

/** Live next-question (one retry), then deterministic fallback so it never breaks. */
export async function getNextQuestion(answers: Answer[]): Promise<NextQuestionResponse> {
  if (stageModeOn()) return nextQuestionFallbackResponse(answers);
  try {
    return await postWithRetry<NextQuestionResponse>("/api/next-question", {
      locale: LOCALE,
      answers,
      askedIds: answers.map((a) => a.questionId),
      questionCount: intakeCount(answers),
    });
  } catch {
    return nextQuestionFallbackResponse(answers);
  }
}

export async function getMatch(answers: Answer[]): Promise<MatchResponse> {
  if (stageModeOn()) return matchFallbackResponse(answers);
  try {
    return await postWithRetry<MatchResponse>("/api/match", {
      locale: LOCALE,
      answers,
      filters: extractFilters(answers),
    });
  } catch {
    return matchFallbackResponse(answers);
  }
}

export { getCoach };
