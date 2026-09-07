"use client";

import posthog from "posthog-js";

export const ANALYTICS_CONSENT_KEY = "motif_analytics_consent";
export type AnalyticsConsent = "accepted" | "rejected";

const CONSENT_EVENT = "motif:analytics-consent";
const GA_SCRIPT_ID = "motif-gtag";
const DEFAULT_GA_MEASUREMENT_ID = "G-906SQMQT76";

let posthogInitialized = false;
let googleAnalyticsInitialized = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getGaMeasurementId() {
  return (
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ||
    DEFAULT_GA_MEASUREMENT_ID
  );
}

export function isPostHogConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST,
  );
}

export function isGoogleAnalyticsConfigured() {
  return Boolean(getGaMeasurementId());
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
    initAnalyticsIfAllowed();
  } else {
    disableAnalytics();
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

export function initAnalyticsIfAllowed() {
  initPostHogIfAllowed();
  initGoogleAnalyticsIfAllowed();
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

export function initGoogleAnalyticsIfAllowed() {
  if (typeof window === "undefined") return false;
  if (!isGoogleAnalyticsConfigured()) return false;
  if (getAnalyticsConsent() !== "accepted") return false;

  const measurementId = getGaMeasurementId();
  if (!measurementId) return false;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(..._args: unknown[]) {
      // gtag.js expects the Arguments object, not a rest-args array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }

  if (googleAnalyticsInitialized) {
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    });
    window.gtag("config", measurementId);
    return true;
  }

  window.gtag("js", new Date());
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  window.gtag("config", measurementId);

  if (!document.getElementById(GA_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  googleAnalyticsInitialized = true;
  return true;
}

function disableAnalytics() {
  if (posthogInitialized) {
    posthog.opt_out_capturing();
    posthog.reset();
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  }
}

export function openConsentPreferences() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ANALYTICS_CONSENT_KEY);
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: null }),
  );
}
