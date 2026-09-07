import type { Metadata } from "next";
import { Jost, Bodoni_Moda, Lobster_Two, Elsie, Rubik_Spray_Paint, Jacquarda_Bastarda_9, Dancing_Script } from "next/font/google";
import { auth } from "../auth";
import CookieConsent from "./components/cookie-consent";
import { PostHogIdentity } from "./components/motion-elements";
import { getSiteUrl } from "./lib/site-url";
import "./globals.css";

const siteDescription =
  "Upload six images you love. Motif names your vibe, maps your color DNA, and helps you shop things that actually look like you.";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});

const elsie = Elsie({
  weight: ["400", "900"],
  subsets: ["latin"],
  variable: "--font-elsie",
});

const rubikSprayPaint = Rubik_Spray_Paint({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-rubik-spray-paint",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

const jacquardaBastarda9 = Jacquarda_Bastarda_9({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-jacquarda-bastarda-9",
});

const lobsterTwo = Lobster_Two({
  variable: "--font-lobster-two",
  subsets: ["latin"],
  weight: "700"
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Motif — Find your vibe",
    template: "%s · Motif",
  },
  description: siteDescription,
  applicationName: "Motif",
  keywords: [
    "visual taste",
    "aesthetic profile",
    "vibe finder",
    "color DNA",
    "taste-based shopping",
    "Motif",
  ],
  authors: [{ name: "Motif" }],
  creator: "Motif",
  publisher: "Motif",
  icons: {
    icon: [
      { url: "/fav-2.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Motif",
    title: "Motif — Find your vibe",
    description: siteDescription,
    url: "/",
    images: [
      {
        url: "/assets/600shots_so.png",
        width: 1920,
        height: 1440,
        alt: "Motif vibe results on a laptop — Opulent Maximalism taste profile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motif — Find your vibe",
    description: siteDescription,
    images: ["/assets/600shots_so.png"],
  },
  category: "lifestyle",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${jost.variable} ${bodoniModa.variable} ${lobsterTwo.variable} ${elsie.variable} ${rubikSprayPaint.variable} ${jacquardaBastarda9.variable} ${dancingScript.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PostHogIdentity
          userId={session?.user?.id || undefined}
          email={session?.user?.email}
          name={session?.user?.name}
        />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
