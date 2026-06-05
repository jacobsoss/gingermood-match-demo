import { COPY } from "@/lib/copy";

/** Always-visible label that this is synthetic demo data (GDPR / honesty). */
export function SampleBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-hair bg-surface px-3 py-1 text-[13px] text-muted ${className}`}
    >
      {COPY.sampleDataBadge}
    </span>
  );
}
