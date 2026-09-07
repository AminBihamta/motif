"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getAnalyticsConsent,
  initAnalyticsIfAllowed,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
  type AnalyticsConsent,
} from "../lib/analytics-consent";

export default function CookieConsent() {
  const [preference, setPreference] = useState<AnalyticsConsent | null | "loading">(
    "loading",
  );

  useEffect(() => {
    const current = getAnalyticsConsent();
    setPreference(current);
    if (current === "accepted") {
      initAnalyticsIfAllowed();
    }

    return subscribeAnalyticsConsent((value) => {
      setPreference(value);
      if (value === "accepted") {
        initAnalyticsIfAllowed();
      }
    });
  }, []);

  if (preference === "loading" || preference !== null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie and analytics preferences"
      className="fixed inset-x-0 bottom-0 z-[100] border-t-2 border-motif-ivory bg-motif-black p-4 text-motif-ivory shadow-[0_-8px_0_var(--color-motif-red)] sm:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-motif-red">
            Cookies / analytics
          </p>
          <p className="mt-2 text-sm leading-6 text-motif-ivory/80 sm:text-base sm:leading-7">
            Motif uses necessary cookies for your taste profile and sign-in.
            Optional analytics (Google Analytics and PostHog) help us improve the
            product and only run if you accept. Read our{" "}
            <Link
              href="/privacy"
              className="font-bold text-motif-ivory underline decoration-motif-red decoration-2 underline-offset-4"
            >
              Privacy
            </Link>{" "}
            and{" "}
            <Link
              href="/cookies"
              className="font-bold text-motif-ivory underline decoration-motif-red decoration-2 underline-offset-4"
            >
              Cookies
            </Link>{" "}
            pages.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setAnalyticsConsent("rejected")}
            className="cursor-pointer border-2 border-motif-ivory bg-transparent px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] transition-colors hover:bg-motif-ivory hover:text-motif-black"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => setAnalyticsConsent("accepted")}
            className="cursor-pointer border-2 border-motif-ivory bg-motif-red px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] transition-colors hover:bg-motif-ivory hover:text-motif-red"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
