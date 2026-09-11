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
import { useCopy, useLang } from "@/components/platform/LanguageProvider";

type DimensionKey = keyof CheckinScores;

interface Question {
  key: DimensionKey;
  label: string;
  low: string;
  high: string;
  short: string;
}

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
  const t = useCopy();
  return (
    <div className="gm-rise" style={delay ? { animationDelay: delay } : undefined}>
      <Card className="flex items-start gap-3 p-6">
        <span className="mt-0.5 shrink-0 text-purple">
          <IconShield size={18} />
        </span>
        <div>
          <SectionLabel>{t.checkin.privacyCard.label}</SectionLabel>
          <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
            {t.checkin.privacyCard.body}
          </p>
        </div>
      </Card>
    </div>
  );
}

function PrivacyLine() {
  const t = useCopy();
  return (
    <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
      <span className="mt-0.5 shrink-0 text-purple">
        <IconShield size={15} />
      </span>
      {t.checkin.privacyCard.line}
    </p>
  );
}

function HelpCard({ id }: { id: string }) {
  const t = useCopy();
  const item = LIBRARY_BY_ID[id];
  if (!item) return null;
  return (
    <Link href={`/dashboard/library/${item.id}`} className="gm-focus group block rounded-[var(--radius-card)]">
      <Card className="h-full p-5 transition-colors group-hover:border-purple">
        <span className="flex items-center gap-2 text-purple">
          {item.kind === "video" ? <IconPlay size={16} /> : <IconBook size={16} />}
          <span className="text-[13px] font-semibold">
            {t.checkin.helpCard.meta(item.kind, item.minutes)}
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
  const t = useCopy();
  const { lang } = useLang();
  const { ready, user, employee, completeCheckin } = useDemo();

  const QUESTIONS: Question[] = [
    { key: "energy", ...t.checkin.questions.energy },
    { key: "workload", ...t.checkin.questions.workload },
    { key: "balance", ...t.checkin.questions.balance },
    { key: "sleep", ...t.checkin.questions.sleep },
    { key: "connection", ...t.checkin.questions.connection },
    { key: "overall", ...t.checkin.questions.overall },
  ];

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
          title={t.checkin.employerEmpty.title}
          body={t.checkin.employerEmpty.body}
          action={
            <Link href="/dashboard" className={btnSecondary}>
              {t.common.actions.goToDashboard}
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
              {t.common.actions.back}
            </button>
            <p className="text-[13px] font-semibold tabular-nums text-muted">
              {t.checkin.flow.progress(step + 1, QUESTIONS.length)}
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
                aria-label={t.checkin.a11y.option(n)}
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
      ? t.checkin.result.summarySteady
      : t.checkin.result.summary(
          t.checkin.dimensionNoun[strongest[0].key],
          t.checkin.dimensionNoun[strongest[1].key],
          strongest[1].value >= 4 ? t.checkin.result.solidHigh : t.checkin.result.solidBest,
          t.checkin.weakPhrase[weakest.key],
        );

    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <header className="gm-rise">
          <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">
            {t.checkin.result.thanks(firstName(user.name))}
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {t.checkin.result.subtitle}
          </p>
        </header>

        <div className="gm-rise mt-7" style={{ animationDelay: "60ms" }}>
          <Card className="p-6 sm:p-7">
            <SectionLabel>{t.checkin.result.noticed}</SectionLabel>
            <p className="mt-3 max-w-[560px] text-[16px] leading-relaxed text-ink">{summary}</p>
          </Card>
        </div>

        <div className="gm-rise mt-6" style={{ animationDelay: "120ms" }}>
          <SectionLabel>{t.checkin.result.help}</SectionLabel>
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
            {t.checkin.result.backToOverview}
          </button>
          <Link href="/dashboard" className={btnSecondary}>
            {t.common.actions.goToDashboard}
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
          {t.checkin.intro.title}
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          {t.checkin.intro.subtitle}
        </p>
      </header>

      {checkins.length === 0 ? (
        <div className="gm-rise mt-7" style={{ animationDelay: "60ms" }}>
          <Card className="p-7 sm:p-8">
            <span className="text-purple">
              <IconPulse size={22} />
            </span>
            <h2 className="mt-3 font-display text-[22px] font-semibold text-ink">
              {t.checkin.intro.firstTitle}
            </h2>
            <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-muted">
              {t.checkin.intro.firstBody}
            </p>
            <button type="button" onClick={startFlow} className={`${btnPrimary} mt-6`}>
              {t.checkin.intro.start}
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
              {t.checkin.intro.again}
            </button>
            {lastCheckin && (
              <p className="text-[14px] text-muted">{t.checkin.intro.lastCheckin(timeAgo(lastCheckin.dateISO, lang))}</p>
            )}
          </div>

          <div className="gm-rise mt-4" style={{ animationDelay: "120ms" }}>
            <Card className="p-6 sm:p-7">
              <SectionLabel>{t.checkin.trend.label}</SectionLabel>
              <p className="mt-2 text-[15px] text-muted">
                {t.checkin.trend.desc}
              </p>
              <div className="mt-4">
                <TrendChart
                  data={checkins.map((c) => ({
                    label: formatDayShort(c.dateISO, lang),
                    value: c.scores.overall,
                  }))}
                  min={1}
                  max={5}
                  formatValue={(v) => v.toFixed(0)}
                />
              </div>

              <div className="mt-5 border-t border-hair pt-5">
                <SectionLabel>{t.checkin.trend.byDimension}</SectionLabel>
                <ul className="mt-2 flex flex-col divide-y divide-hair">
                  {QUESTIONS.map((q) => {
                    const series = checkins.map((c) => c.scores[q.key]);
                    const latest = series[series.length - 1];
                    return (
                      <li key={q.key} className="flex items-center gap-4 py-2.5">
                        <span className="flex-1 text-[14px] font-semibold text-ink">{q.short}</span>
                        <Sparkline values={series} />
                        <span className="w-9 text-right text-[14px] tabular-nums text-muted">
                          {t.checkin.trend.score(latest)}
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
