import type { Metadata, Viewport } from "next";
import { zillaSlab, inter } from "./fonts";
import { DemoProvider } from "@/lib/demo/store";
import { LanguageProvider } from "@/components/platform/LanguageProvider";
import { getServerLang, getServerCopy } from "@/lib/platform/lang-server";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerCopy();
  return { title: t.meta.root.title, description: t.meta.root.description };
}

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
