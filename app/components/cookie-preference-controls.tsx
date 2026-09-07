"use client";

import { useEffect, useState } from "react";
import {
  getAnalyticsConsent,
  openConsentPreferences,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
  type AnalyticsConsent,
} from "../lib/analytics-consent";

export default function CookiePreferenceControls() {
  const [preference, setPreference] = useState<AnalyticsConsent | null>(null);

  useEffect(() => {
    setPreference(getAnalyticsConsent());
    return subscribeAnalyticsConsent((value) => setPreference(value));
  }, []);

  const label =
    preference === "accepted"
      ? "Analytics accepted"
      : preference === "rejected"
        ? "Analytics rejected"
        : "No choice saved yet";

  return (
    <div className="space-y-4 border-2 border-motif-ivory bg-motif-charcoal p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-motif-red">
        Manage analytics
      </p>
      <p className="text-sm leading-6 text-motif-ivory/75">
        Current preference: <span className="font-bold text-motif-ivory">{label}</span>
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => setAnalyticsConsent("accepted")}
          className="cursor-pointer border-2 border-motif-ivory bg-motif-red px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] transition-colors hover:bg-motif-ivory hover:text-motif-red"
        >
          Accept analytics
        </button>
        <button
          type="button"
          onClick={() => setAnalyticsConsent("rejected")}
          className="cursor-pointer border-2 border-motif-ivory bg-transparent px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] transition-colors hover:bg-motif-ivory hover:text-motif-black"
        >
          Reject analytics
        </button>
        <button
          type="button"
          onClick={() => openConsentPreferences()}
          className="cursor-pointer border-2 border-motif-blue bg-motif-blue px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] transition-colors hover:bg-motif-ivory hover:text-motif-blue"
        >
          Show banner again
        </button>
      </div>
    </div>
  );
}
