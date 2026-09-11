"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ARTICLES } from "@/lib/demo/articles";
import { LIBRARY, LIBRARY_BY_ID } from "@/lib/demo/seeds";
import type { LibraryItem } from "@/lib/demo/types";
import { Card, EmptyState, SectionLabel, btnLink, btnSecondary } from "@/components/platform/ui";
import { IconBook, IconPlay } from "@/components/platform/icons";
import { useCopy } from "@/components/platform/LanguageProvider";

/** Two other items from the same category — a quiet "keep going" row. */
function RelatedRow({ item }: { item: LibraryItem }) {
  const t = useCopy();
  const related = LIBRARY.filter((i) => i.category === item.category && i.id !== item.id).slice(
    0,
    2,
  );
  if (related.length === 0) return null;
  return (
    <div className="mt-10 border-t border-hair pt-6">
      <SectionLabel>{t.library.detail.relatedHeading(item.category)}</SectionLabel>
      <ul className="mt-4 flex flex-col gap-3">
        {related.map((r) => (
          <li key={r.id}>
            <Link
              href={`/dashboard/library/${r.id}`}
              className="gm-focus group -m-1 flex items-start gap-3 rounded-[var(--radius-input)] p-1"
            >
              <span className="mt-0.5 shrink-0 text-purple">
                {r.kind === "video" ? <IconPlay size={16} /> : <IconBook size={16} />}
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-purple-700">
                  {r.title}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted">
                  {t.library.kindLabel(r.kind, r.minutes)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArticleDetail({ item }: { item: LibraryItem }) {
  const t = useCopy();
  const body = ARTICLES[item.id];
  return (
    <article className="gm-rise mt-6 max-w-[640px]" style={{ animationDelay: "60ms" }}>
      <h1 className="font-display text-[28px] font-semibold text-ink">{item.title}</h1>
      <p className="mt-2 text-[14px] text-muted">
        {t.library.detail.articleMeta(item.category, item.minutes)}
      </p>

      {body ? (
        <>
          <div className="mt-6 flex flex-col gap-4">
            {body.paragraphs.map((p) => (
              <p key={p.slice(0, 32)} className="text-[17px] leading-relaxed text-ink">
                {p}
              </p>
            ))}
          </div>
          <RelatedRow item={item} />
        </>
      ) : (
        <>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">{item.teaser}</p>
          <Card className="mt-6 p-7">
            <p className="text-[16px] font-semibold text-ink">
              {t.library.detail.articleFullVersion}
            </p>
            <div className="mt-4 flex flex-col gap-2.5" aria-hidden="true">
              <div className="h-3.5 w-full rounded-full bg-wash" />
              <div className="h-3.5 w-4/5 rounded-full bg-wash" />
            </div>
            <Link href="/dashboard/library" className={`${btnLink} mt-5 inline-block`}>
              {t.library.detail.backToLibrary}
            </Link>
          </Card>
        </>
      )}
    </article>
  );
}

function VideoDetail({ item }: { item: LibraryItem }) {
  const t = useCopy();
  return (
    <div className="gm-rise mt-6 max-w-[640px]" style={{ animationDelay: "60ms" }}>
      <h1 className="font-display text-[28px] font-semibold text-ink">{item.title}</h1>
      <p className="mt-2 text-[14px] text-muted">
        {t.library.detail.videoMeta(item.category, item.minutes)}
      </p>
      <div className="relative mt-6 flex aspect-video flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] bg-ink">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tint text-purple-700">
          <IconPlay size={22} />
        </span>
        <p className="text-[15px] text-white/80">{t.library.detail.videoFullVersion}</p>
        <span className="absolute bottom-3 right-3 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-medium text-white">
          {t.library.minutesBadge(item.minutes)}
        </span>
      </div>
      <p className="mt-5 text-[17px] leading-relaxed text-muted">{item.teaser}</p>
    </div>
  );
}

export default function LibraryItemPage() {
  const t = useCopy();
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const item = id ? LIBRARY_BY_ID[id] : undefined;

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
      <div className="gm-rise">
        <Link href="/dashboard/library" className={btnLink}>
          {t.library.detail.backLink}
        </Link>
      </div>

      {!item ? (
        <div className="gm-rise mt-6" style={{ animationDelay: "60ms" }}>
          <EmptyState
            icon={<IconBook size={20} />}
            title={t.library.notFound.title}
            body={t.library.notFound.body}
            action={
              <Link href="/dashboard/library" className={btnSecondary}>
                {t.library.detail.backToLibrary}
              </Link>
            }
          />
        </div>
      ) : item.kind === "video" ? (
        <VideoDetail item={item} />
      ) : (
        <ArticleDetail item={item} />
      )}
    </div>
  );
}
