"use client";

import posthog from "posthog-js";

export const ANALYTICS_CONSENT_KEY = "motif_analytics_consent";
export type AnalyticsConsent = "accepted" | "rejected";

const CONSENT_EVENT = "motif:analytics-consent";

let posthogInitialized = false;

export function isPostHogConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST,
  );
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  if (value === "accepted" || value === "rejected") return value;
  return null;
}

export function isAnalyticsAllowed() {
  return getAnalyticsConsent() === "accepted" && isPostHogReady();
}

export function isPostHogReady() {
  return posthogInitialized;
}

export function setAnalyticsConsent(value: AnalyticsConsent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: value }),
  );

  if (value === "accepted") {
    initPostHogIfAllowed();
  } else if (posthogInitialized) {
    posthog.opt_out_capturing();
    posthog.reset();
  }
}

export function subscribeAnalyticsConsent(
  listener: (value: AnalyticsConsent | null) => void,
) {
  if (typeof window === "undefined") return () => undefined;

  const handler = (event: Event) => {
    const detail = (event as CustomEvent<AnalyticsConsent>).detail;
    listener(detail ?? getAnalyticsConsent());
  };

  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}

export function initPostHogIfAllowed() {
  if (typeof window === "undefined") return false;
  if (!isPostHogConfigured()) return false;
  if (getAnalyticsConsent() !== "accepted") return false;
  if (posthogInitialized) {
    posthog.opt_in_capturing();
    return true;
  }

  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!token || !host) return false;

  posthog.init(token, {
    api_host: host,
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
    persistence: "localStorage+cookie",
  });
  posthogInitialized = true;
  return true;
}

export function openConsentPreferences() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ANALYTICS_CONSENT_KEY);
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: null }),
  );
}
