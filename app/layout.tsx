import "./globals.css";

import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const DESCRIPTION =
  "Tell Wingman the occasion and see yourself ready: a full look from real Singapore stores, tried on your photo and one tap from checkout.";

export const metadata: Metadata = {
  metadataBase: new URL("https://wingman-1608.vercel.app"),
  title: { default: "Wingman", template: "%s · Wingman" },
  description: DESCRIPTION,
  openGraph: { title: "Wingman", description: DESCRIPTION, siteName: "Wingman", type: "website" },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, title: "Wingman", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${dmSerifDisplay.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Entrance motion only runs when script does, so nothing stays hidden without it */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
