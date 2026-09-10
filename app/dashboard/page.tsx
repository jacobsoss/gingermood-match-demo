"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDemo } from "@/lib/demo/store";
import { useCopy } from "@/components/platform/LanguageProvider";
import { LIBRARY_BY_ID, recommendedFor } from "@/lib/demo/seeds";
import { firstName, formatDay, formatTime, timeGreeting } from "@/lib/demo/format";
import { getCoach } from "@/data/coaches";
import { SPECIALISM_LABEL } from "@/lib/labels";
import { Avatar } from "@/components/Avatar";
import { Bar } from "@/components/Bar";
import { Sparkline } from "@/components/platform/charts";
import { Tour } from "@/components/platform/Tour";
import {
  Card,
  ConfirmedBadge,
  SectionLabel,
  Skeleton,
  btnPrimary,
  btnSecondary,
} from "@/components/platform/ui";
import {
  IconBook,
  IconCheck,
  IconClock,
  IconPlay,
  IconPulse,
  IconShield,
} from "@/components/platform/icons";

// Captured at module load — a render-pure "now" (fresh enough for day-level
// comparisons; the page module reloads every visit).
const PAGE_LOADED_AT = Date.now();

const TOUR_STEPS = [
  {
    target: '[data-tour="match"]',
    title: "Start with your match",
    body: "Answer a few questions — in your own words or out loud — and we find the coach who actually fits you.",
  },
  {
    target: '[data-tour="library"]',
    title: "Browse the library",
    body: "Short, practical reads and videos — picked for what you're working on.",
  },
  {
    target: '[data-tour="checkin"]',
    title: "Check in each quarter",
    body: "Six quick questions. Personal to you — your employer only ever sees anonymous team trends.",
  },
];

/** Quieter cards that sit around the main element in both states. */
function LibraryTeaser({ ids }: { ids: string[] }) {
  const items = ids.map((id) => LIBRARY_BY_ID[id]).filter(Boolean);
  return (
    <Card className="p-6" data-tour="library">
      <div className="flex items-center justify-between gap-3">
        <SectionLabel>From the library</SectionLabel>
        <Link
          href="/dashboard/library"
          className="gm-focus rounded-sm text-[14px] font-semibold text-purple hover:underline"
        >
          Browse all
        </Link>
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/dashboard/library/${item.id}`}
              className="gm-focus group flex items-start gap-3 rounded-[var(--radius-input)] p-1 -m-1"
            >
              <span className="mt-0.5 text-purple">
                {item.kind === "video" ? <IconPlay size={16} /> : <IconBook size={16} />}
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold leading-snug text-ink group-hover:text-purple-700">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted">
                  {item.category} · {item.minutes} min
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function CheckinTeaser({ done }: { done: boolean }) {
  return (
    <Card className="p-6" data-tour="checkin">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-purple">
          <IconPulse size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <SectionLabel>Quarterly check-in</SectionLabel>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            {done
              ? "Done for this quarter — your trends are on the check-in page."
              : "Six quick questions about how work feels right now. About a minute."}
          </p>
          <Link href="/dashboard/checkin" className={`${btnSecondary} mt-4`}>
            {done ? "View my trends" : "Start check-in"}
          </Link>
        </div>
      </div>
    </Card>
  );
}

function PrivacyLine() {
  return (
    <p className="flex items-start gap-2 text-[13px] leading-relaxed text-muted">
      <span className="mt-0.5 shrink-0 text-purple">
        <IconShield size={15} />
      </span>
      Your employer never sees your individual answers — only anonymous, team-level insights.
    </p>
  );
}

export default function DashboardHome() {
  const { ready, user, employee, respondNudge, setTourDone } = useDemo();
  const t = useCopy();
  const router = useRouter();
  const [showTour, setShowTour] = useState<boolean | null>(null);

  if (!ready || !user || !employee) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-7 h-52 w-full" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  const matched = employee.match;
  const coach = matched ? getCoach(matched.coachId) : undefined;
  const tourOpen = showTour ?? (!employee.tourDone && !matched);

  const upcoming = employee.sessions
    .filter((s) => s.status === "upcoming" && new Date(s.whenISO).getTime() > PAGE_LOADED_AT)
    .sort((a, b) => a.whenISO.localeCompare(b.whenISO));
  const nextSession = upcoming[0];
  const completed = employee.sessions.filter((s) => s.status === "completed").length;
  const energySeries = employee.checkins.map((c) => c.scores.energy);
  const recs = recommendedFor(matched?.theme, 3).map((i) => i.id);
  const checkinDoneRecently =
    employee.checkins.length > 0 &&
    PAGE_LOADED_AT - new Date(employee.checkins[employee.checkins.length - 1]!.dateISO).getTime() <
      45 * 86_400_000;

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
      {/* Greeting */}
      <header className="gm-rise">
        <h1 className="font-body text-[28px] font-semibold text-ink sm:text-[32px]">
          {timeGreeting()}, {firstName(user.name)}
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          {matched && coach
            ? `Trajectory with ${firstName(coach.name)} · ${SPECIALISM_LABEL[matched.theme]}`
            : t.dashboard.greetingNew}
        </p>
      </header>

      {!matched && (
        /* ── State A — a calm start, one obvious action (§6) ──────────────── */
        <div className="mt-7 flex flex-col gap-4">
          <div
            data-tour="match"
            className="gm-rise rounded-[var(--radius-card)] border border-hair bg-surface p-7 shadow-[var(--shadow-coach)] sm:p-9"
            style={{ animationDelay: "60ms" }}
          >
            <p className="eyebrow text-purple">Your next step</p>
            <h2 className="mt-3 font-body text-[24px] font-semibold leading-snug text-ink sm:text-[27px]">
              {t.dashboard.actions.findSupport.title}
            </h2>
            <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-muted">
              {t.dashboard.actions.findSupport.body}
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/match")}
              className={`${btnPrimary} mt-6`}
            >
              {t.dashboard.actions.findSupport.title}
            </button>
            <p className="mt-4 max-w-lg text-[13px] leading-relaxed text-muted">
              {t.dashboard.humanNote} {t.dashboard.reviewSimulatedNote}
            </p>
          </div>

          {/* Check-in is offered, never required before coaching */}
          <div className="gm-rise grid gap-4 sm:grid-cols-2" style={{ animationDelay: "140ms" }}>
            <Card className="p-6" data-tour="checkin">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-purple">
                  <IconPulse size={18} />
                </span>
                <div>
                  <h3 className="font-body text-[17px] font-semibold text-ink">
                    {t.dashboard.actions.checkin.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                    {t.dashboard.actions.checkin.body}
                  </p>
                  <Link href="/dashboard/checkin" className={`${btnSecondary} mt-4`}>
                    Check in
                  </Link>
                </div>
              </div>
            </Card>
            <LibraryTeaser ids={recs} />
          </div>

          <div className="gm-rise" style={{ animationDelay: "200ms" }}>
            <PrivacyLine />
          </div>
        </div>
      )}

      {matched && coach && (
        /* ── State B — the living product ─────────────────────────────────── */
        <div className="mt-7 flex flex-col gap-4">
          {/* My coach — the only shadowed card */}
          <Card className="gm-rise p-6 shadow-[var(--shadow-coach)] sm:p-7" >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar initials={coach.initials} size="lg" />
                <div>
                  <h2 className="font-display text-2xl font-semibold text-ink">{coach.name}</h2>
                  <p className="mt-0.5 text-[15px] text-muted">
                    {SPECIALISM_LABEL[coach.specialisms[0]!]} · {coach.region}
                  </p>
                </div>
              </div>
              <ConfirmedBadge />
            </div>

            {nextSession ? (
              <p className="mt-5 flex items-center gap-2 text-[15px] text-ink">
                <span className="text-purple">
                  <IconClock size={16} />
                </span>
                Next session: {formatDay(nextSession.whenISO)} at {formatTime(nextSession.whenISO)}
              </p>
            ) : (
              <p className="mt-5 text-[15px] text-muted">No session booked yet.</p>
            )}

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/dashboard/sessions" className={btnPrimary}>
                Book a session
              </Link>
              <Link href="/dashboard/coach" className={btnSecondary}>
                View profile
              </Link>
              <Link href="/dashboard/coach#messages" className={btnSecondary}>
                Send a message
              </Link>
            </div>

            {/* Trajectory progress strip */}
            <div className="mt-6 border-t border-hair pt-4">
              <div className="mb-1.5 flex items-baseline justify-between">
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Trajectory
                </p>
                <p className="text-[13px] tabular-nums text-muted">
                  session {Math.min(completed + 1, matched.sessionsPlanned)} of{" "}
                  {matched.sessionsPlanned}
                </p>
              </div>
              <Bar value={(completed / matched.sessionsPlanned) * 100} />
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-muted">
              {t.dashboard.reviewSimulatedNote}
            </p>
          </Card>

          {/* Wellbeing trend + nudge */}
          <div className="gm-rise grid gap-4 sm:grid-cols-2" style={{ animationDelay: "100ms" }}>
            {energySeries.length >= 2 && (
              <Card className="p-6">
                <SectionLabel>Your wellbeing</SectionLabel>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-[15px] leading-relaxed text-ink">
                    Your energy is trending up since you started.
                  </p>
                  <Sparkline values={energySeries} />
                </div>
                <Link
                  href="/dashboard/checkin"
                  className="gm-focus mt-3 inline-block rounded-sm text-[14px] font-semibold text-purple hover:underline"
                >
                  View check-in history
                </Link>
              </Card>
            )}

            {employee.nudge && (
              <Card className="p-6">
                <SectionLabel>From your last session</SectionLabel>
                <p className="mt-3 text-[15px] leading-relaxed text-ink">
                  You wanted to try the &lsquo;{employee.nudge.habit.toLowerCase()}&rsquo; habit.
                  How&apos;s it going?
                </p>
                {employee.nudge.response ? (
                  <p className="gm-rise mt-3 flex items-start gap-2 text-[14px] leading-relaxed text-muted">
                    <span className="mt-0.5 text-purple">
                      <IconCheck size={15} />
                    </span>
                    {employee.nudge.response === "well"
                      ? "Noted — nice and steady. Mara will be glad to hear it."
                      : "Noted. That's useful to know — bring it to your next session, or revisit the article below."}
                  </p>
                ) : (
                  <div className="mt-4 flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => respondNudge("well")}
                      className={`${btnSecondary} min-h-[40px] px-5 text-[14px]`}
                    >
                      Going well
                    </button>
                    <button
                      type="button"
                      onClick={() => respondNudge("struggling")}
                      className={`${btnSecondary} min-h-[40px] px-5 text-[14px]`}
                    >
                      Struggling
                    </button>
                  </div>
                )}
                <Link
                  href={`/dashboard/library/${employee.nudge.libraryId}`}
                  className="gm-focus mt-3 inline-block rounded-sm text-[14px] font-semibold text-purple hover:underline"
                >
                  Re-read the article
                </Link>
              </Card>
            )}
          </div>

          <div className="gm-rise grid gap-4 sm:grid-cols-2" style={{ animationDelay: "160ms" }}>
            <LibraryTeaser ids={recs} />
            <CheckinTeaser done={checkinDoneRecently} />
          </div>

          <div className="gm-rise" style={{ animationDelay: "220ms" }}>
            <PrivacyLine />
          </div>
        </div>
      )}

      {tourOpen && (
        <Tour
          steps={TOUR_STEPS}
          onDone={() => {
            setShowTour(false);
            setTourDone();
          }}
        />
      )}
    </div>
  );
}
