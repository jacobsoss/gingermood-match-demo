"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useDemo } from "@/lib/demo/store";
import type { SessionType } from "@/lib/demo/types";
import { firstName, formatDay, formatTime, timeAgo } from "@/lib/demo/format";
import { getCoach } from "@/data/coaches";
import { METHOD_LABEL, SPECIALISM_LABEL, STYLE_LABEL } from "@/lib/labels";
import { Avatar } from "@/components/Avatar";
import {
  Card,
  ConfirmedBadge,
  EmptyState,
  Skeleton,
  btnPrimary,
  btnSecondary,
} from "@/components/platform/ui";
import { IconCheck, IconClock, IconUser } from "@/components/platform/icons";
import { useCopy } from "@/components/platform/LanguageProvider";

const inputCls =
  "gm-focus w-full rounded-[var(--radius-input)] border-[1.5px] border-hair bg-surface px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-muted";

/** Lavender supply tag — same element as the quiz's coach card. */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-wash px-3 py-1 text-[13px] font-semibold text-purple-700">
      {children}
    </span>
  );
}

export default function CoachPage() {
  const t = useCopy();
  const { ready, employee, sendMessage } = useDemo();
  const [draft, setDraft] = useState("");

  const sessionTypeLabel: Record<SessionType, string> = {
    video: t.coachPage.sessionType.video,
    "in-person": t.coachPage.sessionType.inPerson,
    phone: t.coachPage.sessionType.phone,
  };

  if (!ready || !employee) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-7 h-80 w-full" />
        <Skeleton className="mt-4 h-20 w-full" />
        <Skeleton className="mt-4 h-64 w-full" />
      </div>
    );
  }

  const match = employee.match;
  const coach = match ? getCoach(match.coachId) : undefined;

  if (!match || !coach) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <header className="gm-rise">
          <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">
            {t.coachPage.empty.title}
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {t.coachPage.empty.intro}
          </p>
        </header>
        <div className="gm-rise mt-7" style={{ animationDelay: "80ms" }}>
          <EmptyState
            icon={<IconUser size={22} />}
            title={t.coachPage.empty.noCoachTitle}
            body={t.coachPage.empty.noCoachBody}
            action={
              <Link href="/dashboard/match" className={btnPrimary}>
                {t.coachPage.empty.getMatched}
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const coachFirst = firstName(coach.name);
  const nextSession = employee.sessions
    .filter((s) => s.status === "upcoming" && new Date(s.whenISO) > new Date())
    .sort((a, b) => a.whenISO.localeCompare(b.whenISO))[0];
  const thread = [...employee.messages].sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    sendMessage(text);
    setDraft("");
  };

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
      <header className="gm-rise">
        <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">
          {t.coachPage.header.title}
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          {t.coachPage.header.intro(coachFirst)}
        </p>
      </header>

      <div className="mt-7 flex flex-col gap-4">
        {/* ── Profile — the one shadowed card on this page ─────────────────── */}
        <Card className="gm-rise p-6 shadow-[var(--shadow-coach)] sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar initials={coach.initials} size="xl" />
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">{coach.name}</h2>
                <p className="mt-1 text-[15px] text-muted">
                  {SPECIALISM_LABEL[coach.specialisms[0]!]} · {coach.region} ·{" "}
                  {coach.yearsExperience} {t.coachPage.profile.yearsExperience}
                </p>
              </div>
            </div>
            <ConfirmedBadge />
          </div>

          <p className="mt-5 text-[16px] italic leading-relaxed text-muted">
            &ldquo;{coach.tagline}&rdquo;
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{coach.bio}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {coach.specialisms.map((s) => (
              <Tag key={s}>{SPECIALISM_LABEL[s]}</Tag>
            ))}
            {coach.workingStyle.map((w) => (
              <Tag key={w}>{STYLE_LABEL[w]}</Tag>
            ))}
          </div>

          <div className="mt-5 border-t border-hair pt-4">
            <p className="text-[13px] text-muted">{t.coachPage.profile.werkwijze}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {coach.methods.map((m) => (
                <Tag key={m}>{METHOD_LABEL[m]}</Tag>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-hair pt-4">
            <p className="text-[13px] text-muted">{t.coachPage.profile.bestFitFor}</p>
            <ul className="mt-2 flex flex-col gap-2">
              {coach.bestFitFor.slice(0, 3).map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2 text-[15px] leading-relaxed text-ink"
                >
                  <span className="mt-0.5 shrink-0 text-purple">
                    <IconCheck size={15} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link href="/dashboard/sessions" className={btnPrimary}>
              {t.coachPage.profile.bookSession}
            </Link>
            <a href="#messages" className={btnSecondary}>
              {t.coachPage.profile.sendMessage}
            </a>
          </div>
        </Card>

        {/* ── Next session strip ───────────────────────────────────────────── */}
        {nextSession && (
          <div className="gm-rise" style={{ animationDelay: "80ms" }}>
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-purple">
                    <IconClock size={18} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
                      {t.coachPage.nextSession.label}
                    </p>
                    <p className="mt-0.5 text-[15px] text-ink">
                      {formatDay(nextSession.whenISO)} {t.common.datetime.at}{" "}
                      {formatTime(nextSession.whenISO)} ·{" "}
                      {sessionTypeLabel[nextSession.type]}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/sessions"
                  className="gm-focus rounded-sm text-[14px] font-semibold text-purple hover:underline"
                >
                  {t.coachPage.nextSession.manage}
                </Link>
              </div>
            </Card>
          </div>
        )}

        {/* ── Messages ─────────────────────────────────────────────────────── */}
        <div id="messages" className="gm-rise scroll-mt-24" style={{ animationDelay: "160ms" }}>
          <Card className="p-6 sm:p-7">
            <h2 className="font-display text-xl font-semibold text-ink">
              {t.coachPage.messages.heading(coachFirst)}
            </h2>

            {thread.length === 0 ? (
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                {t.coachPage.messages.empty(coachFirst)}
              </p>
            ) : (
              <ul className="mt-5 flex flex-col gap-4">
                {thread.map((m) =>
                  m.from === "coach" ? (
                    <li key={m.id} className="flex items-start gap-3">
                      <Avatar initials={coach.initials} size="sm" />
                      <div className="min-w-0 max-w-[85%] sm:max-w-[75%]">
                        <div className="rounded-[var(--radius-input)] bg-wash p-3.5 text-[15px] leading-relaxed text-ink">
                          {m.text}
                        </div>
                        <p className="mt-1 text-[12px] text-muted">{timeAgo(m.dateISO)}</p>
                      </div>
                    </li>
                  ) : (
                    <li key={m.id} className="flex justify-end">
                      <div className="min-w-0 max-w-[85%] sm:max-w-[75%]">
                        <div className="rounded-[var(--radius-input)] bg-tint p-3.5 text-[15px] leading-relaxed text-ink">
                          {m.text}
                        </div>
                        <p className="mt-1 text-right text-[12px] text-muted">
                          {timeAgo(m.dateISO)}
                        </p>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            )}

            <form onSubmit={submit} className="mt-6 flex gap-2.5 border-t border-hair pt-5">
              <label htmlFor="coach-message" className="sr-only">
                {t.coachPage.a11y.messageLabel(coachFirst)}
              </label>
              <input
                id="coach-message"
                type="text"
                autoComplete="off"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t.coachPage.ph.message(coachFirst)}
                className={`${inputCls} min-w-0 flex-1`}
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className={`${btnPrimary} min-h-[44px] px-6 text-[15px]`}
              >
                {t.coachPage.messages.send}
              </button>
            </form>
            <p className="mt-3 text-[13px] text-muted">
              {t.coachPage.messages.disclaimer}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
