"use client";

import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { EMPLOYER } from "@/lib/demo/seeds";
import { RequireRole } from "@/components/platform/guard";
import { TrendChart, ZoneBar, ZoneLegend } from "@/components/platform/charts";
import { Card, IllustrativeTag, SectionLabel, Stat } from "@/components/platform/ui";
import { IconArrowUp, IconLogout, IconShield } from "@/components/platform/icons";

function pct(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

/** Minimal employer chrome — same 3px stripe + 68px bar as the product shell. */
function EmployerChrome() {
  const { user, logout } = useDemo();
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40">
      <div className="h-[3px] w-full bg-orange" />
      <header className="h-[68px] border-b border-hair bg-surface/85 backdrop-blur">
        <div className="flex h-full items-center justify-between gap-4 px-5 sm:px-7">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Gingermood" className="h-7 w-auto" />
          <div className="flex items-center gap-2.5">
            {user && (
              <span className="hidden text-[14px] font-semibold text-ink sm:inline">
                {user.name}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              aria-label="Sign out"
              title="Sign out"
              className="gm-focus flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-wash hover:text-ink"
            >
              <IconLogout size={18} />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

function EmployerOverview() {
  const k = EMPLOYER.kpis;

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 sm:px-8">
      {/* Page header */}
      <header className="gm-rise">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">
            {EMPLOYER.company} — Workforce wellbeing overview
          </h1>
          <IllustrativeTag />
        </div>
        <p className="mt-1 text-[15px] text-muted">Quarterly view · updated this week</p>
      </header>

      {/* KPI row */}
      <div
        className="gm-rise mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        style={{ animationDelay: "60ms" }}
      >
        <Card className="p-6">
          <Stat label="Participation" value={pct(k.participation)} />
        </Card>
        <Card className="p-6">
          <Stat
            label="Average wellbeing index"
            value={k.wellbeingIndex.toFixed(1)}
            sub={
              <span className="inline-flex items-center gap-1">
                <span className="text-purple">
                  <IconArrowUp size={13} />
                </span>
                +{k.indexDelta.toFixed(1)} vs last quarter
              </span>
            }
          />
        </Card>
        <Card className="p-6">
          <Stat label="Sessions this quarter" value={k.sessionsQuarter} />
        </Card>
        <Card className="p-6">
          <Stat
            label="Check-ins in the green"
            value={`${k.checkinSplit.green}%`}
            sub={`${k.checkinSplit.orange}% orange · ${k.checkinSplit.red}% red`}
          />
        </Card>
      </div>

      {/* Wellbeing by department */}
      <div className="gm-rise mt-4" style={{ animationDelay: "120ms" }}>
        <Card className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionLabel>Wellbeing by department</SectionLabel>
            <ZoneLegend />
          </div>
          <ul className="mt-5 flex flex-col gap-5">
            {EMPLOYER.departments.map((d) => (
              <li key={d.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[15px] font-semibold text-ink">{d.name}</p>
                  <p className="text-[13px] tabular-nums text-muted">{d.headcount} people</p>
                </div>
                <div className="mt-2">
                  <ZoneBar green={d.green} orange={d.orange} red={d.red} />
                </div>
                <p className="mt-1.5 text-[12px] tabular-nums text-muted">
                  {d.green}% · {d.orange}% · {d.red}%
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-hair pt-4">
            <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
              <span className="mt-0.5 shrink-0 text-purple">
                <IconShield size={15} />
              </span>
              Minimum group size {EMPLOYER.minGroupSize} — individual answers are never shown.
            </p>
          </div>
        </Card>
      </div>

      {/* Trend + matching quality */}
      <div
        className="gm-rise mt-4 grid gap-4 lg:grid-cols-2"
        style={{ animationDelay: "180ms" }}
      >
        <Card className="p-6 sm:p-7">
          <SectionLabel>Wellbeing trend</SectionLabel>
          <div className="mt-4">
            <TrendChart data={[...EMPLOYER.trend]} min={6} max={8} />
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-ink">
            Steady upward drift since the programme started.
          </p>
        </Card>

        <Card className="p-6 sm:p-7">
          <SectionLabel>Matching quality</SectionLabel>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            <Stat label="Intake completion" value={pct(EMPLOYER.matching.completionRate)} />
            <Stat
              label="Re-match rate"
              value={pct(EMPLOYER.matching.rematchRate)}
              sub="people who asked for a different coach"
            />
            <Stat
              label="Average session rating"
              value={`${EMPLOYER.matching.avgRating.toFixed(1)} / 5`}
            />
          </div>
          <p className="mt-6 border-t border-hair pt-4 text-[14px] leading-relaxed text-muted">
            We measure whether matches work — and fix the ones that don&apos;t.
          </p>
        </Card>
      </div>

      <p className="gm-rise mt-6 text-[14px] text-muted" style={{ animationDelay: "240ms" }}>
        Full employer analytics arrive with the pilot programme.
      </p>
    </div>
  );
}

export default function EmployerPage() {
  return (
    <RequireRole role="employer">
      <div className="flex min-h-dvh flex-col bg-page">
        <EmployerChrome />
        <main className="min-w-0 flex-1">
          <EmployerOverview />
        </main>
      </div>
    </RequireRole>
  );
}
