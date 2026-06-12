import Link from "next/link";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
];

/**
 * Public-site chrome: same 3px orange stripe + frosted 68px nav as the product,
 * so marketing and app read as one brand. Server component (no state).
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
            <nav aria-label="Main">
              <ul className="flex items-center gap-1 sm:gap-2">
                {LINKS.map((l) => (
                  <li key={l.href} className="hidden sm:block">
                    <Link
                      href={l.href}
                      className="gm-focus rounded-md px-3 py-2 text-[15px] font-semibold text-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/login"
                    className="gm-focus rounded-md px-3 py-2 text-[15px] font-semibold text-purple transition-colors hover:text-purple-700"
                  >
                    Log in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="gm-focus inline-flex min-h-[42px] items-center rounded-full bg-orange px-5 text-[15px] font-semibold text-ink transition-all hover:bg-orange-600 active:scale-[0.98]"
                  >
                    Get started
                  </Link>
                </li>
              </ul>
            </nav>
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
              The right coach for every person. Matching on real needs — checked by a human,
              measured for outcomes.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
              Explore
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {[...LINKS, { href: "/login", label: "Log in" }].map((l) => (
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
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
              About this site
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">
              This is a product demo. All people, companies and statistics shown are
              fictional and illustrative.
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
