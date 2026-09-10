import Link from "next/link";
import { getServerCopy } from "@/lib/platform/lang-server";
import { MarketingNav } from "./MarketingNav";

/**
 * Public-site chrome: same 3px orange stripe + frosted 68px nav as the product,
 * so marketing and app read as one brand. Server component; reads the language
 * from the cookie so it re-renders on switch. The interactive nav (audience
 * links, mobile menu, language switcher) is the client MarketingNav.
 */
export async function MarketingShell({ children }: { children: React.ReactNode }) {
  const t = await getServerCopy();
  const footerLinks = [
    { href: "/employers", label: t.nav.employers },
    { href: "/employees", label: t.nav.employees },
    { href: "/how-it-works", label: t.nav.howItWorks },
    { href: "/about", label: t.nav.about },
    { href: "/privacy", label: t.nav.privacy },
    { href: "/login", label: t.nav.login },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <div className="sticky top-0 z-40">
        <div className="h-[3px] w-full bg-orange" />
        <header className="h-[68px] border-b border-hair bg-surface/85 backdrop-blur">
          <div className="mx-auto flex h-full max-w-[1080px] items-center justify-between gap-6 px-6 sm:px-8">
            <Link href="/" className="gm-focus -m-2 rounded-md p-2" aria-label={t.a11y.logoHome}>
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
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted">{t.shell.footer.blurb}</p>
          </div>
          <nav aria-label={t.a11y.footer}>
            <p className="eyebrow text-muted">{t.shell.footer.explore}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {footerLinks.map((l) => (
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
            <p className="eyebrow text-muted">{t.shell.footer.aboutTitle}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">{t.shell.footer.aboutBody}</p>
          </div>
        </div>
        <div className="border-t border-hair">
          <div className="mx-auto max-w-[1080px] px-6 py-4 sm:px-8">
            <p className="text-[13px] text-muted">{t.shell.footer.location}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
