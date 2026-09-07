"use client";

import posthog from "posthog-js";
import {
  initPostHogIfAllowed,
  isAnalyticsAllowed,
  isPostHogConfigured,
} from "./analytics-consent";

export function capturePostHogEvent(
  event: string,
  properties?: Record<string, boolean | number | string>,
) {
  if (!isPostHogConfigured()) return;

  initPostHogIfAllowed();

  if (isAnalyticsAllowed()) {
    posthog.capture(event, properties);
  }
}
