import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typografie — Styleguide · Gingermood",
  description: "Type scale QA (Zilla Slab + Inter).",
};

/* A labelled specimen row: spec on the left, live sample on the right. */
function Row({
  spec,
  children,
}: {
  spec: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 border-t border-hair py-8 md:grid-cols-[180px_1fr] md:gap-8">
      <p className="eyebrow pt-1 text-muted">{spec}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-8">
        <p className="eyebrow text-purple">Styleguide</p>
        <h1 className="mt-3">Typografie</h1>
        <p className="measure mt-4 text-[18px] leading-[1.65] text-muted">
          Zilla Slab voor koppen, Inter voor tekst en UI. Verklein het venster
          onder 768&nbsp;px om de mobiele schaal te controleren — de koppen
          schalen mee.
        </p>
      </header>

      {/* ---- Headings ---- */}
      <Row spec="H1 · Zilla Slab 600 · 48/40px · lh 1.15 · ls −0.01em">
        <h1>Waarom kiezen voor Gingermood?</h1>
      </Row>

      <Row spec="H1 · lange kop (wrap-test, text-wrap: balance)">
        <h1>
          Waarom kiezen steeds meer werkgevers voor drempelloze, gematchte
          coaching die écht aansluit bij de medewerker?
        </h1>
      </Row>

      <Row spec="H2 · Zilla Slab 600 · 34/28px · lh 1.2">
        <h2>De juiste coach voor iedere medewerker</h2>
      </Row>

      <Row spec="H2 · lange kop (wrap-test)">
        <h2>
          Van herkenning en zelf-matchen tot meetbare uitkomsten binnen één
          pilotperiode
        </h2>
      </Row>

      <Row spec="H3 · Zilla Slab 500 · 24/22px · lh 1.3">
        <h3>Zo werkt het voor jouw organisatie</h3>
      </Row>

      {/* ---- Labels & body ---- */}
      <Row spec="Eyebrow / kicker · Inter 500 · 13px · ls 0.08em · uppercase">
        <p className="eyebrow text-purple">Voor werkgevers</p>
      </Row>

      <Row spec="Body large (intro) · Inter 400 · 18px · lh 1.65">
        <p className="measure font-body text-[18px] leading-[1.65]">
          Gingermood begint bij een goede match. De medewerker vertelt kort wat
          er speelt, wij matchen op de werkelijke behoefte, en een mens
          bevestigt de keuze — drempelloos en zonder wachtlijst.
        </p>
      </Row>

      <Row spec="Body · Inter 400 · 16px · lh 1.65">
        <p className="measure font-body text-[16px] leading-[1.65]">
          Waar generieke welzijnsapps vooral breedte en een bibliotheek bieden,
          draait Gingermood om gematchte diepgang met gemeten resultaten. De
          werkgever ziet nooit individuen; rapportage bestaat uitsluitend op
          groepsniveau, technisch afgedwongen via k-anonimiteit. Zo blijft de
          drempel om hulp te zoeken laag en de privacy geborgd.
        </p>
      </Row>

      <Row spec="Small / caption / legal · Inter 400 · 14px · lh 1.5">
        <p className="measure font-body text-[14px] leading-[1.5] text-muted">
          Illustratieve gegevens. Aan deze demonstratie kunnen geen rechten
          worden ontleend. Verwerking vindt plaats binnen de EU.
        </p>
      </Row>

      {/* ---- UI ---- */}
      <Row spec="Buttons & nav · Inter 500 · 15px">
        <div className="flex flex-wrap items-center gap-5">
          <button className="rounded-full bg-orange px-5 py-2.5 font-body text-[15px] font-medium text-white">
            Plan een gesprek
          </button>
          <nav className="flex gap-5 font-body text-[15px] font-medium text-ink">
            <a href="#" className="hover:text-purple">
              Hoe het werkt
            </a>
            <a href="#" className="hover:text-purple">
              Voor werkgevers
            </a>
            <a href="#" className="hover:text-purple">
              Over ons
            </a>
          </nav>
        </div>
      </Row>

      <Row spec="Form inputs · Inter 400 · 15px">
        <label className="block max-w-sm">
          <span className="mb-1.5 block font-body text-[14px] font-medium text-ink">
            Aantal medewerkers
          </span>
          <input
            type="text"
            defaultValue="840"
            className="w-full rounded-input border border-hair bg-surface px-3.5 py-2.5 font-body text-[15px] text-ink outline-none focus:border-purple"
          />
        </label>
      </Row>

      <Row spec="Tables / data · Inter 400 · 15px (tabular)">
        <table className="w-full max-w-md border-collapse font-body text-[15px] [font-variant-numeric:tabular-nums]">
          <tbody>
            <tr className="border-b border-hair">
              <td className="py-2 text-muted">Abonnement</td>
              <td className="py-2 text-right font-medium text-ink">€ 63.000</td>
            </tr>
            <tr className="border-b border-hair">
              <td className="py-2 text-muted">Trajectkosten</td>
              <td className="py-2 text-right font-medium text-ink">€ 76.000</td>
            </tr>
            <tr>
              <td className="py-2 font-medium text-ink">Totaal per jaar</td>
              <td className="py-2 text-right font-medium text-ink">€ 139.000</td>
            </tr>
          </tbody>
        </table>
      </Row>
    </main>
  );
}
