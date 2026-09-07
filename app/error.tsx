"use client";

import { useEffect } from "react";
import {
  StatusPage,
  StatusRetryButton,
  StatusSecondaryLink,
} from "./components/status-page";

export default function Error({
  error,
  retry,
}: Readonly<{
  error: Error & { digest?: string };
  retry: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code="Error 500 / glitch"
      eyebrow="Signal interrupted"
      title="Something"
      italic="slipped."
      description="Motif hit an unexpected fault. Retry this view, or step back to the homepage while we settle the noise."
      actions={
        <>
          <StatusRetryButton onClick={retry}>Try again</StatusRetryButton>
          <StatusSecondaryLink href="/">Back to Motif</StatusSecondaryLink>
        </>
      }
    />
  );
}
