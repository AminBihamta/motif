import type { Metadata } from "next";
import {
  StatusPage,
  StatusPrimaryLink,
  StatusSecondaryLink,
} from "./components/status-page";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <StatusPage
      code="Error 404 / signal"
      eyebrow="No page on file"
      title="This room"
      italic="is empty."
      description="The URL drifted off the map. Head home, or start a fresh taste decode with six images."
      actions={
        <>
          <StatusPrimaryLink href="/">Back to Motif</StatusPrimaryLink>
          <StatusSecondaryLink href="/find-my-vibe">
            Find my vibe
          </StatusSecondaryLink>
        </>
      }
    />
  );
}
