import type { Metadata } from "next";
import { Jost, Bodoni_Moda, Lobster_Two, Elsie, Rubik_Spray_Paint, Jacquarda_Bastarda_9, Dancing_Script } from "next/font/google";
import { auth } from "../auth";
import { PostHogIdentity } from "./components/motion-elements";
import "./globals.css";

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
  title: "Motif",
  description: "Your vibe finder",
  icons: {
    icon: [{ url: "/fav-2.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
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
      </body>
    </html>
  );
}
