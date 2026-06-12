import Link from "next/link";
import { MarketingShell } from "@/components/platform/MarketingShell";

export default function HomePage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-[1080px] px-6 py-20 sm:px-8">
        <h1 className="font-display text-[40px] font-semibold text-ink">
          The right coach for every person
        </h1>
        <p className="mt-4 max-w-xl text-[18px] leading-relaxed text-muted">
          Tell us your story, we match you on what you actually need — and a human confirms
          it before anything starts.
        </p>
        <Link
          href="/register"
          className="gm-focus mt-8 inline-flex min-h-[52px] items-center rounded-full bg-orange px-8 text-[17px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98]"
        >
          Get started
        </Link>
      </div>
    </MarketingShell>
  );
}
