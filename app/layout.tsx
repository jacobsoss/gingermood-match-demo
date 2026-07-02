import type { Metadata, Viewport } from "next";
import { zillaSlab, inter } from "./fonts";
import { DemoProvider } from "@/lib/demo/store";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gingermood — The right coach for every person",
  description:
    "Coaching that starts with a proper match: tell us your story, we match you on real needs, a human confirms. Product demo with illustrative data.",
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
      lang="en"
      className={`${zillaSlab.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full font-body">
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
