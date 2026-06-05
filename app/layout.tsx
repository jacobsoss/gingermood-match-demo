import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

// Display only (h1/h2/h3, coach name, score). Weight 500–600 per §2.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
});

// Body/UI — 400 body, 600 emphasis/buttons. Readable across a dinner table.
const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Gingermood — Vind de coach die bij jou past",
  description:
    "Adaptieve intake die jouw specifieke behoeften matcht aan de werkelijke expertise van een coach. Demo met synthetische voorbeeldgegevens.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#faf8f5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${fraunces.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
