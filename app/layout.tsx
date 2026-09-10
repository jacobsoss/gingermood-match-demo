import type { Metadata, Viewport } from "next";
import { zillaSlab, inter } from "./fonts";
import { DemoProvider } from "@/lib/demo/store";
import { LanguageProvider } from "@/components/platform/LanguageProvider";
import { getServerLang } from "@/lib/platform/lang-server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gingermood — the right psychologist or coach",
  description:
    "Personal guidance that starts with a careful match, checked by a person. Product demo with illustrative data.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#faf8f5",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getServerLang();
  return (
    <html
      lang={lang}
      className={`${zillaSlab.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full font-body">
        <LanguageProvider initialLang={lang}>
          <DemoProvider>{children}</DemoProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
