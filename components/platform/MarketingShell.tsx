import Link from "next/link";
import { PLATFORM } from "@/lib/platform/copy";
import { MarketingNav } from "./MarketingNav";

const FOOTER_LINKS = [
  { href: "/employers", label: PLATFORM.nav.employers },
  { href: "/employees", label: PLATFORM.nav.employees },
  { href: "/how-it-works", label: PLATFORM.nav.howItWorks },
  { href: "/about", label: PLATFORM.nav.about },
  { href: "/privacy", label: PLATFORM.nav.privacy },
  { href: "/login", label: PLATFORM.nav.login },
];

/**
 * Public-site chrome: same 3px orange stripe + frosted 68px nav as the product,
 * so marketing and app read as one brand. Server component; the interactive nav
 * (audience links + mobile menu) is the client MarketingNav.
 */
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <div className="sticky top-0 z-40">
        <div className="h-[3px] w-full bg-orange" />
        <header className="h-[68px] border-b border-hair bg-surface/85 backdrop-blur">
          <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between gap-6 px-6 sm:px-8">
            <Link href="/" className="gm-focus -m-2 rounded-md p-2" aria-label="Gingermood — home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Gingermood" className="h-7 w-auto" />
            </Link>
            <MarketingNav />
          </div>
        </header>
      </div>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-hair bg-surface">
        <div className="mx-auto grid max-w-[1080px] gap-8 px-6 py-10 sm:grid-cols-3 sm:px-8">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Gingermood" className="h-6 w-auto" />
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted">
              The right psychologist or coach for every person. Matched on real needs — with a
              person involved.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow text-muted">Explore</p>
            <ul className="mt-3 flex flex-col gap-2">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="gm-focus rounded-sm text-[15px] text-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow text-muted">About this site</p>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">
              This is a product demo. All people, companies and statistics shown are fictional
              and illustrative — it is not a production system.
            </p>
          </div>
        </div>
        <div className="border-t border-hair">
          <div className="mx-auto max-w-[1080px] px-6 py-4 sm:px-8">
            <p className="text-[13px] text-muted">Gingermood · Amsterdam, The Netherlands</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
