"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/lib/demo/store";
import { LIBRARY, LIBRARY_CATEGORIES, recommendedFor } from "@/lib/demo/seeds";
import type { LibraryCategory, LibraryItem } from "@/lib/demo/types";
import {
  Card,
  Chip,
  EmptyState,
  SectionLabel,
  Skeleton,
  btnSecondary,
} from "@/components/platform/ui";
import { IconBook, IconPlay, IconSearch, IconX } from "@/components/platform/icons";
import { useCopy } from "@/components/platform/LanguageProvider";

function KindIcon({ item, size = 15 }: { item: LibraryItem; size?: number }) {
  return item.kind === "video" ? <IconPlay size={size} /> : <IconBook size={size} />;
}

function LibraryCard({ item }: { item: LibraryItem }) {
  const t = useCopy();
  return (
    <Link
      href={`/dashboard/library/${item.id}`}
      className="gm-focus group block h-full rounded-[var(--radius-card)]"
    >
      <Card className="flex h-full flex-col p-5 transition-colors group-hover:border-purple">
        {item.kind === "video" && (
          <div className="relative mb-4 flex aspect-[16/9] items-center justify-center rounded-[var(--radius-input)] bg-wash">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-tint text-purple-700">
              <IconPlay size={18} />
            </span>
            <span className="absolute bottom-2 right-2 rounded-full bg-ink/70 px-2 py-0.5 text-[12px] font-medium text-white">
              {t.library.minutesBadge(item.minutes)}
            </span>
          </div>
        )}
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-muted">
          <span className="text-purple">
            <KindIcon item={item} />
          </span>
          {t.library.kindLabel(item.kind, item.minutes)}
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-purple-700">
          {item.title}
        </h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{item.teaser}</p>
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center rounded-full bg-wash px-3 py-1 text-[12px] font-semibold text-purple-700">
            {item.category}
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default function LibraryPage() {
  const t = useCopy();
  const { ready, employee } = useDemo();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<LibraryCategory | "All">("All");

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="mt-2 h-5 w-72" />
        <Skeleton className="mt-7 h-[52px] w-full" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
      </div>
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = LIBRARY.filter((item) => {
    if (category !== "All" && item.category !== category) return false;
    if (!q) return true;
    return item.title.toLowerCase().includes(q) || item.teaser.toLowerCase().includes(q);
  });

  const recs = employee?.match ? recommendedFor(employee.match.theme, 3) : [];
  const showRecs = recs.length > 0 && q === "" && category === "All";

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
      <header className="gm-rise">
        <h1 className="font-display text-[28px] font-semibold text-ink sm:text-[32px]">{t.library.header.title}</h1>
        <p className="mt-1 text-[15px] text-muted">
          {t.library.header.subtitle}
        </p>
      </header>

      {/* Search + category filter */}
      <div className="gm-rise mt-7" style={{ animationDelay: "60ms" }}>
        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            <IconSearch size={18} />
          </div>
          <input
            type="text"
            value={query}
            autoComplete="off"
            aria-label={t.library.search.ariaLabel}
            placeholder={t.library.search.placeholder}
            onChange={(e) => setQuery(e.target.value)}
            className="gm-focus w-full rounded-[var(--radius-input)] border-[1.5px] border-hair bg-surface py-3.5 pl-12 pr-11 text-[16px] text-ink outline-none transition-colors placeholder:text-muted"
          />
          {query && (
            <button
              type="button"
              aria-label={t.library.search.clearAria}
              onClick={() => setQuery("")}
              className="gm-focus absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition-colors hover:bg-wash hover:text-ink"
            >
              <IconX size={16} />
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip active={category === "All"} onClick={() => setCategory("All")}>
            {t.library.filters.all}
          </Chip>
          {LIBRARY_CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>

      {/* Recommended for you — only with a confirmed match, only when unfiltered */}
      {showRecs && (
        <section className="gm-rise mt-7" style={{ animationDelay: "120ms" }}>
          <SectionLabel>{t.library.recommended.heading}</SectionLabel>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {recs.map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/library/${item.id}`}
                className="gm-focus group flex items-start gap-2.5 rounded-[var(--radius-input)] border border-hair bg-surface p-4 transition-colors hover:border-purple"
              >
                <span className="mt-0.5 shrink-0 text-purple">
                  <KindIcon item={item} size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold leading-snug text-ink transition-colors group-hover:text-purple-700">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-muted">{t.library.kindLabel(item.kind, item.minutes)}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Catalog */}
      <div className="gm-rise mt-7" style={{ animationDelay: "180ms" }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<IconSearch size={20} />}
            title={t.library.noMatches.title}
            body={t.library.noMatches.body}
            action={
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
                className={btnSecondary}
              >
                {t.library.noMatches.action}
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((item) => (
              <LibraryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
