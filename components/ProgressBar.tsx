import { COPY } from "@/lib/copy";

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((current / Math.max(1, total)) * 100)));
  return (
    <div className="w-full">
      <p className="mb-2 text-[13px] text-muted">{COPY.question.progress(current, total)}</p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-tint">
        <div
          className="h-full rounded-full bg-orange transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
