"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Answer, MatchResponse, Question } from "@/lib/types";
import { getMatch, getNextQuestion } from "@/lib/engine";
import { filterTotal, intakeCount, selectNextFilter } from "@/lib/filters";
import { PERSONAS_BY_ID } from "@/data/personas";
import { useDemo } from "@/lib/demo/store";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { QuestionScreen } from "@/components/QuestionScreen";
import { ThinkingScreen } from "@/components/ThinkingScreen";
import { ProcessingScreen } from "@/components/ProcessingScreen";

type Screen = "welcome" | "question" | "thinking" | "processing";

/**
 * The existing intake quiz, relocated verbatim into the dashboard (DECISIONS.md
 * D7/D8). Logic, API routes, fallback engine and dictation are untouched; the
 * only change is that a finished match is persisted to the demo store and the
 * user lands on /dashboard/match/result instead of an in-page result screen.
 */
export default function MatchPage() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [expectedTotal, setExpectedTotal] = useState(5);
  // True while awaiting the next question (Live mode network call) — drives the
  // "thinking" indicator so the UI never looks frozen.
  const [busy, setBusy] = useState(false);
  // Retains each given answer by question id, so going Back repopulates the box
  // for editing. Kept even when an answer is popped off the active path.
  const [answeredById, setAnsweredById] = useState<Record<string, Answer>>({});

  const { setLastResult } = useDemo();
  const router = useRouter();

  // Holds the computed match while the processing animation plays.
  const pendingResult = useRef<MatchResponse | null>(null);

  const goProcessing = useCallback(
    (finalAnswers: Answer[]) => {
      pendingResult.current = null;
      setScreen("processing");
      void getMatch(finalAnswers).then((res) => {
        pendingResult.current = res;
      });
    },
    [],
  );

  const advance = useCallback(
    async (nextAnswers: Answer[]) => {
      // Phase 1 — hard filter questions (instant, client-side, no AI).
      const filterQ = selectNextFilter(nextAnswers);
      if (filterQ) {
        setQuestion(filterQ);
        // Before depth is chosen intakeCount() defaults to the medium estimate.
        setExpectedTotal(filterTotal(nextAnswers) + intakeCount(nextAnswers));
        setScreen("question");
        return;
      }
      // Phase 2 — curated/adaptive AI loop: animate into a loading phase while
      // the next question is generated, then slide the question in.
      setBusy(true);
      setScreen("thinking");
      try {
        const r = await getNextQuestion(nextAnswers);
        if (r.done || !r.question) {
          goProcessing(nextAnswers);
        } else {
          setQuestion(r.question);
          setExpectedTotal(filterTotal(nextAnswers) + r.expectedTotal);
          setScreen("question");
        }
      } finally {
        setBusy(false);
      }
    },
    [goProcessing],
  );

  const handleStart = useCallback(() => {
    setAnswers([]);
    setAnsweredById({});
    void advance([]);
  }, [advance]);

  const handleAnswer = useCallback(
    (answer: Answer) => {
      setAnsweredById((prev) => ({ ...prev, [answer.questionId]: answer }));
      const next = [...answers, answer];
      setAnswers(next);
      void advance(next);
    },
    [answers, advance],
  );

  const handleBack = useCallback(() => {
    if (answers.length === 0) {
      setScreen("welcome");
      return;
    }
    const trimmed = answers.slice(0, -1);
    setAnswers(trimmed);
    void advance(trimmed);
  }, [answers, advance]);

  const handlePickPersona = useCallback(
    (id: string) => {
      const persona = PERSONAS_BY_ID[id];
      if (!persona) return;
      setAnswers(persona.answers);
      setAnsweredById(
        Object.fromEntries(persona.answers.map((a) => [a.questionId, a])),
      );
      goProcessing(persona.answers);
    },
    [goProcessing],
  );

  const handleProcessingComplete = useCallback(() => {
    const settle = () => {
      if (pendingResult.current) {
        setLastResult(pendingResult.current);
        router.push("/dashboard/match/result");
      } else {
        // Match still computing (rare); check again shortly.
        setTimeout(settle, 120);
      }
    };
    settle();
  }, [setLastResult, router]);

  return (
    <div className="min-h-[calc(100dvh-var(--nav-h))] bg-page">
      {screen === "welcome" && (
        <WelcomeScreen onStart={handleStart} onPickPersona={handlePickPersona} busy={busy} />
      )}

      {screen === "question" && question && (
        <QuestionScreen
          key={question.id}
          question={question}
          initialAnswer={answeredById[question.id]}
          index={answers.length + 1}
          total={expectedTotal}
          onAnswer={handleAnswer}
          onBack={handleBack}
          canGoBack={true}
          busy={busy}
        />
      )}

      {screen === "thinking" && <ThinkingScreen />}

      {screen === "processing" && (
        <ProcessingScreen onComplete={handleProcessingComplete} />
      )}
    </div>
  );
}
