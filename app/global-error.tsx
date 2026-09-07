"use client";

import { Bodoni_Moda, Jost } from "next/font/google";
import { useEffect } from "react";
import posthog from "posthog-js";
import {
  StatusPage,
  StatusRetryButton,
  StatusSecondaryLink,
} from "./components/status-page";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});

export default function GlobalError({
  error,
  retry,
}: Readonly<{
  error: Error & { digest?: string };
  retry: () => void;
}>) {
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.captureException(error);
    }
  }, [error]);

  return (
    <html
      lang="en"
      className={`${jost.variable} ${bodoniModa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-motif-black text-motif-ivory">
        <StatusPage
          code="Error 500 / root"
          eyebrow="Hard interrupt"
          title="The stage"
          italic="went dark."
          description="A root-level fault stopped the page from rendering. Retry, or return home and continue from there."
          actions={
            <>
              <StatusRetryButton onClick={retry}>Try again</StatusRetryButton>
              <StatusSecondaryLink href="/">Back to Motif</StatusSecondaryLink>
            </>
          }
        />
      </body>
    </html>
  );
}
