"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDemo } from "@/lib/demo/store";
import { LIBRARY_BY_ID } from "@/lib/demo/seeds";
import type { CheckinScores } from "@/lib/demo/types";
import { firstName, formatDayShort, timeAgo } from "@/lib/demo/format";
import { Bar } from "@/components/Bar";
import { Sparkline, TrendChart } from "@/components/platform/charts";
import {
  Card,
  EmptyState,
  SectionLabel,
  Skeleton,
  btnPrimary,
  btnSecondary,
} from "@/components/platform/ui";
import {
  IconBook,
  IconChevronRight,
  IconPlay,
  IconPulse,
  IconShield,
} from "@/components/platform/icons";

type DimensionKey = keyof CheckinScores;

interface Question {
  key: DimensionKey;
  label: string;
  low: string;
  high: string;
  short: string;
}

const QUESTIONS: Question[] = [
  {
    key: "energy",
    label: "How is your energy at work lately?",
    low: "Running on empty",
    high: "Fully charged",
    short: "Energy",
  },
  {
    key: "workload",
    label: "How manageable is your workload?",
    low: "Drowning in it",
    high: "Comfortably manageable",
    short: "Workload",
  },
  {
    key: "balance",
    label: "How is the balance between work and the rest of life?",
    low: "Work takes everything",
    high: "Healthy balance",
    short: "Balance",
  },
  {
    key: "sleep",
    label: "How are you sleeping?",
    low: "Poorly, most nights",
    high: "Well, most nights",
    short: "Sleep",
  },
  {
    key: "connection",
    label: "How connected do you feel to the people you work with?",
    low: "Quite isolated",
    high: "Genuinely connected",
    short: "Connection",
  },
  {
    key: "overall",
    label: "All things considered, how are you doing at work?",
    low: "Struggling",
    high: "Doing well",
    short: "Overall",
  },
];

/** How we name a dimension mid-sentence in the result summary. */
const DIMENSION_NOUN: Record<DimensionKey, string> = {
  energy: "energy",
  workload: "workload",
  balance: "work-life balance",
  sleep: "sleep",
  connection: "connection with colleagues",
  overall: "overall picture",
};

/** Plain-language flag for the weakest dimension. */
const WEAK_PHRASE: Record<DimensionKey, string> = {
  energy: "your energy is running low",
  workload: "workload is creeping up on you",
  balance: "work is leaking into the rest of life",
  sleep: "sleep is coming up short",
  connection: "you're feeling more isolated than you'd like",
  overall: "work feels heavier than it should right now",
};

/** Two library picks per weakest dimension. */
const HELP_BY_DIMENSION: Record<DimensionKey, [string, string]> = {
  energy: ["lib-02", "lib-10"],
  workload: ["lib-02", "lib-10"],
  sleep: ["lib-04", "lib-09"],
  balance: ["lib-07", "lib-01"],
  connection: ["lib-01", "lib-11"],
  overall: ["lib-01", "lib-11"],
};

function PrivacyCard({ delay }: { delay?: string }) {
  return (
    <div className="gm-rise" style={delay ? { animationDelay: delay } : undefined}>
      <Card className="flex items-start gap-3 p-6">
        <span className="mt-0.5 shrink-0 text-purple">
          <IconShield size={18} />
        </span>
        <div>
          <SectionLabel>Private by design</SectionLabel>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
            Your answers are personal to you. Your employer only ever sees anonymous, team-level
            trends — never your individual answers.
          </p>
        </div>
      </Card>
    </div>
  );
}

function PrivacyLine() {
  return (
    <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
      <span className="mt-0.5 shrink-0 text-purple">
        <IconShield size={15} />
      </span>
      Your answers are personal to you — your employer only ever sees anonymous, team-level
      trends.
    </p>
  );
}

function HelpCard({ id }: { id: string }) {
  const item = LIBRARY_BY_ID[id];
  if (!item) return null;
  return (
    <Link href={`/dashboard/library/${item.id}`} className="gm-focus group block rounded-[var(--radius-card)]">
      <Card className="h-full p-5 transition-colors group-hover:border-purple">
        <span className="flex items-center gap-2 text-purple">
          {item.kind === "video" ? <IconPlay size={16} /> : <IconBook size={16} />}
          <span className="text-[13px] font-semibold">
            {item.kind === "video" ? "Video" : "Article"} · {item.minutes} min
          </span>
        </span>
        <p className="mt-2.5 text-[15px] font-semibold leading-snug text-ink group-hover:text-purple-700">
          {item.title}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">{item.teaser}</p>
      </Card>
    </Link>
  );
}

export default function CheckinPage() {
  const { ready, user, employee, completeCheckin } = useDemo();

  const [view, setView] = useState<"intro" | "flow" | "result">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<CheckinScores>>({});
  const [result, setResult] = useState<CheckinScores | null>(null);
  const submittedRef = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="mt-2 h-5 w-96 max-w-full" />
        <Skeleton className="mt-7 h-64 w-full" />
        <Skeleton className="mt-4 h-28 w-full" />
      </div>
    );
  }

  if (!user || !employee) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <EmptyState
          icon={<IconPulse size={22} />}
          title="Check-ins live in the employee view"
          body="The quarterly check-in is personal to each employee. Employers only ever see anonymous, team-level trends — sign in with an employee account to try it."
          action={
            <Link href="/dashboard" className={btnSecondary}>
              Go to dashboard
            </Link>
          }
        />
      </div>
    );
  }

  const checkins = employee.checkins;
  const lastCheckin = checkins.length > 0 ? checkins[checkins.length - 1] : undefined;

  const startFlow = () => {
    submittedRef.current = false;
    setAnswers({});
    setResult(null);
    setStep(0);
    setView("flow");
  };

  const finish = (a: Partial<CheckinScores>) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const scores: CheckinScores = {
      energy: a.energy ?? 3,
      workload: a.workload ?? 3,
      balance: a.balance ?? 3,
      sleep: a.sleep ?? 3,
      connection: a.connection ?? 3,
      overall: a.overall ?? 3,
    };
    completeCheckin(scores);
    setResult(scores);
    setView("result");
  };

  const select = (value: number) => {
    const q = QUESTIONS[step];
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      if (step < QUESTIONS.length - 1) setStep(step + 1);
      else finish(next);
    }, 250);
  };

  const goBack = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    if (step === 0) setView("intro");
    else setStep(step - 1);
  };

  /* ── View B — one question per screen ─────────────────────────────────── */
  if (view === "flow") {
    const q = QUESTIONS[step];
    const current = answers[q.key];
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <div className="gm-rise max-w-[620px]">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              className="gm-focus inline-flex min-h-[40px] items-center gap-1 rounded-sm text-[15px] font-semibold text-purple transition-colors hover:text-purple-700 hover:underline"
            >
              <span className="rotate-180">
                <IconChevronRight size={16} />
              </span>
              Back
            </button>
            <p className="text-[13px] font-semibold tabular-nums text-muted">
              Question {step + 1} of {QUESTIONS.length}
            </p>
          </div>
          <div className="mt-3">
            <Bar value={(step / 6) * 100} />
          </div>
        </div>

        <div key={step} className="gm-rise mt-10 max-w-[620px]">
          <h1 className="font-display text-[24px] font-semibold leading-snug text-ink">
            {q.label}
          </h1>
          <div className="mt-8 grid grid-cols-5 gap-2 sm:gap-2.5" role="group" aria-label={q.label}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => select(n)}
                aria-pressed={current === n}
                aria-label={`${n} of 5`}
                className={`gm-focus min-h-[56px] rounded-full text-[17px] font-semibold transition-colors active:scale-[0.98] ${
                  current === n ? "bg-purple text-white" : "bg-wash text-purple-700 hover:bg-tint"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-6 text-[13px] text-muted">
            <span>{q.low}</span>
            <span className="text-right">{q.high}</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── View C — warm personal summary ───────────────────────────────────── */
  if (view === "result" && result) {
    const entries = QUESTIONS.map((qu) => ({ key: qu.key, value: result[qu.key] }));
    const strongest = [...entries].sort((a, b) => b.value - a.value).slice(0, 2);
    const strongKeys = strongest.map((e) => e.key);
    const weakest = [...entries]
      .filter((e) => !strongKeys.includes(e.key))
      .sort((a, b) => a.value - b.value)[0];
    const allSteady = entries.every((e) => e.value >= 4);
    const helpIds = HELP_BY_DIMENSION[weakest.key];

    const summary = allSteady
      ? "Things look steady across the board — nothing is flashing orange. Keep doing whatever you're doing, and we'll ask again next quarter."
      : `Your ${DIMENSION_NOUN[strongest[0].key]} and ${DIMENSION_NOUN[strongest[1].key]} ${
          strongest[1].value >= 4 ? "look solid" : "are holding up best"
        }. At the same time, ${WEAK_PHRASE[weakest.key]} — worth keeping an eye on before it grows.`;

    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <header className="gm-rise">
          <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">
            Thanks, {firstName(user.name)}
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            That&apos;s this quarter done. Here&apos;s what stood out.
          </p>
        </header>

        <div className="gm-rise mt-7" style={{ animationDelay: "60ms" }}>
          <Card className="p-6 sm:p-7">
            <SectionLabel>What we noticed</SectionLabel>
            <p className="mt-3 max-w-[560px] text-[16px] leading-relaxed text-ink">{summary}</p>
          </Card>
        </div>

        <div className="gm-rise mt-6" style={{ animationDelay: "120ms" }}>
          <SectionLabel>Two things that might help</SectionLabel>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <HelpCard id={helpIds[0]} />
            <HelpCard id={helpIds[1]} />
          </div>
        </div>

        <div
          className="gm-rise mt-7 flex flex-wrap items-center gap-2.5"
          style={{ animationDelay: "180ms" }}
        >
          <button type="button" onClick={() => setView("intro")} className={btnPrimary}>
            Back to overview
          </button>
          <Link href="/dashboard" className={btnSecondary}>
            Go to dashboard
          </Link>
        </div>

        <div className="gm-rise mt-8" style={{ animationDelay: "240ms" }}>
          <PrivacyLine />
        </div>
      </div>
    );
  }

  /* ── View A — intro & history ─────────────────────────────────────────── */
  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
      <header className="gm-rise">
        <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">
          Wellbeing check-in
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Six quick questions, about a minute. Personal to you.
        </p>
      </header>

      {checkins.length === 0 ? (
        <div className="gm-rise mt-7" style={{ animationDelay: "60ms" }}>
          <Card className="p-7 sm:p-8">
            <span className="text-purple">
              <IconPulse size={22} />
            </span>
            <h2 className="mt-3 font-display text-[22px] font-semibold text-ink">
              Your first check-in
            </h2>
            <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-muted">
              Every quarter we ask the same six questions — energy, workload, balance, sleep,
              connection, and how you&apos;re doing overall. Answer honestly; there are no wrong
              answers. Over time this builds your personal trend, so you spot what&apos;s shifting
              before it becomes a problem.
            </p>
            <button type="button" onClick={startFlow} className={`${btnPrimary} mt-6`}>
              Start check-in
            </button>
          </Card>
        </div>
      ) : (
        <>
          <div
            className="gm-rise mt-7 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "60ms" }}
          >
            <button type="button" onClick={startFlow} className={btnPrimary}>
              Check in again
            </button>
            {lastCheckin && (
              <p className="text-[14px] text-muted">Last check-in {timeAgo(lastCheckin.dateISO)}.</p>
            )}
          </div>

          <div className="gm-rise mt-4" style={{ animationDelay: "120ms" }}>
            <Card className="p-6 sm:p-7">
              <SectionLabel>Your trend</SectionLabel>
              <p className="mt-2 text-[15px] text-muted">
                How you answered &lsquo;all things considered&rsquo; over time, from 1 to 5.
              </p>
              <div className="mt-4">
                <TrendChart
                  data={checkins.map((c) => ({
                    label: formatDayShort(c.dateISO),
                    value: c.scores.overall,
                  }))}
                  min={1}
                  max={5}
                  formatValue={(v) => v.toFixed(0)}
                />
              </div>

              <div className="mt-5 border-t border-hair pt-5">
                <SectionLabel>By dimension</SectionLabel>
                <ul className="mt-2 flex flex-col divide-y divide-hair">
                  {QUESTIONS.map((q) => {
                    const series = checkins.map((c) => c.scores[q.key]);
                    const latest = series[series.length - 1];
                    return (
                      <li key={q.key} className="flex items-center gap-4 py-2.5">
                        <span className="flex-1 text-[14px] font-semibold text-ink">{q.short}</span>
                        <Sparkline values={series} />
                        <span className="w-9 text-right text-[14px] tabular-nums text-muted">
                          {latest}/5
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Card>
          </div>
        </>
      )}

      <div className="mt-4">
        <PrivacyCard delay={checkins.length === 0 ? "120ms" : "180ms"} />
      </div>
    </div>
  );
}
