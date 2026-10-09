import type { Metadata, Viewport } from "next";
import { Caveat, Cormorant, IBM_Plex_Mono, Instrument_Sans, Tiro_Devanagari_Hindi } from "next/font/google";
import { brand } from "@/content/site";
import "./globals.css";

const cormorant = Cormorant({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-instrument", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });
const tiro = Tiro_Devanagari_Hindi({ subsets: ["devanagari"], weight: "400", variable: "--font-tiro", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], weight: "500", variable: "--font-caveat", display: "swap" });

export const metadata: Metadata = {
  /* Set NEXT_PUBLIC_SITE_URL to the live domain at deploy; canonicals and share images resolve against it. */
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: `${brand.name} · ${brand.byline} · ${brand.tagline}`,
  description: `${brand.name}, ${brand.byline}. Courses, test series and guidance for engineering competitive exams. ${brand.promise}`,
  applicationName: brand.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: `${brand.name} · ${brand.byline}`,
    title: `${brand.name} · ${brand.tagline}`,
    description: brand.promise,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f4eee2",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${instrument.variable} ${plexMono.variable} ${tiro.variable} ${caveat.variable}`}>
      <body id="top">{children}</body>
    </html>
  );
}
