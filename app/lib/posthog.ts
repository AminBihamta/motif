"use client";

import posthog from "posthog-js";

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

export function capturePostHogEvent(
  event: string,
  properties?: Record<string, boolean | number | string>,
) {
  if (isPostHogConfigured) {
    posthog.capture(event, properties);
  }
}
