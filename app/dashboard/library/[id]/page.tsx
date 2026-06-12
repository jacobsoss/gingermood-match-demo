"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ARTICLES } from "@/lib/demo/articles";
import { LIBRARY, LIBRARY_BY_ID } from "@/lib/demo/seeds";
import type { LibraryItem } from "@/lib/demo/types";
import { Card, EmptyState, SectionLabel, btnLink, btnSecondary } from "@/components/platform/ui";
import { IconBook, IconPlay } from "@/components/platform/icons";

/** Two other items from the same category — a quiet "keep going" row. */
function RelatedRow({ item }: { item: LibraryItem }) {
  const related = LIBRARY.filter((i) => i.category === item.category && i.id !== item.id).slice(
    0,
    2,
  );
  if (related.length === 0) return null;
  return (
    <div className="mt-10 border-t border-hair pt-6">
      <SectionLabel>More on {item.category}</SectionLabel>
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
                  {r.kind === "video"
                    ? `Video · ${r.minutes} min`
                    : `Article · ${r.minutes} min read`}
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
  const body = ARTICLES[item.id];
  return (
    <article className="gm-rise mt-6 max-w-[640px]" style={{ animationDelay: "60ms" }}>
      <h1 className="font-display text-[28px] font-semibold text-ink">{item.title}</h1>
      <p className="mt-2 text-[14px] text-muted">
        {item.category} · {item.minutes} min read
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
              This article is available in the full version
            </p>
            <div className="mt-4 flex flex-col gap-2.5" aria-hidden="true">
              <div className="h-3.5 w-full rounded-full bg-wash" />
              <div className="h-3.5 w-4/5 rounded-full bg-wash" />
            </div>
            <Link href="/dashboard/library" className={`${btnLink} mt-5 inline-block`}>
              Back to the library
            </Link>
          </Card>
        </>
      )}
    </article>
  );
}

function VideoDetail({ item }: { item: LibraryItem }) {
  return (
    <div className="gm-rise mt-6 max-w-[640px]" style={{ animationDelay: "60ms" }}>
      <h1 className="font-display text-[28px] font-semibold text-ink">{item.title}</h1>
      <p className="mt-2 text-[14px] text-muted">
        {item.category} · Video · {item.minutes} min
      </p>
      <div className="relative mt-6 flex aspect-video flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] bg-ink">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tint text-purple-700">
          <IconPlay size={22} />
        </span>
        <p className="text-[15px] text-white/80">Video available in the full version</p>
        <span className="absolute bottom-3 right-3 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-medium text-white">
          {item.minutes} min
        </span>
      </div>
      <p className="mt-5 text-[17px] leading-relaxed text-muted">{item.teaser}</p>
    </div>
  );
}

export default function LibraryItemPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const item = id ? LIBRARY_BY_ID[id] : undefined;

  return (
    <div className="mx-auto w-full max-w-[880px] px-6 py-8 sm:px-8">
      <div className="gm-rise">
        <Link href="/dashboard/library" className={btnLink}>
          ← Library
        </Link>
      </div>

      {!item ? (
        <div className="gm-rise mt-6" style={{ animationDelay: "60ms" }}>
          <EmptyState
            icon={<IconBook size={20} />}
            title={"We couldn't find that one"}
            body="The link may be out of date, or the item has moved. The library has plenty more worth your time."
            action={
              <Link href="/dashboard/library" className={btnSecondary}>
                Back to the library
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
