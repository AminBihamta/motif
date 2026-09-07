import type { Metadata } from "next";
import Link from "next/link";
import CookiePreferenceControls from "../components/cookie-preference-controls";
import { LegalPageShell, SUPPORT_EMAIL } from "../components/legal-page-shell";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "How Motif uses necessary cookies and optional analytics, and how to change your choice.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiesPage() {
  return (
    <LegalPageShell title="Cookie policy" eyebrow="Legal / cookies">
      <p>Last updated: 7 September 2026.</p>

      <section className="space-y-3">
        <h2>Overview</h2>
        <p>
          Motif uses necessary cookies so your taste profile and sign-in work.
          Optional analytics (Google Analytics and PostHog) run only if you opt
          in. Change your choice anytime below or via the site banner. Contact{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with
          questions. See also our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <CookiePreferenceControls />

      <section className="space-y-3">
        <h2>Necessary</h2>
        <ul>
          <li>
            <strong>motif_anonymous_owner</strong> — HTTP-only cookie identifying
            your anonymous browser owner for about one year so we can save and
            show your taste profile before you sign in.
          </li>
          <li>
            <strong>Auth.js session cookies</strong> — keep you signed in after
            Google or email/password authentication.
          </li>
        </ul>
        <p>
          These are required for core functionality and are not gated behind the
          analytics banner.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Analytics (opt-in)</h2>
        <ul>
          <li>
            <strong>Google Analytics (GA4)</strong> — traffic and engagement
            measurement via measurement ID{" "}
            <code className="text-motif-taupe">G-906SQMQT76</code> (or{" "}
            <code className="text-motif-taupe">NEXT_PUBLIC_GA_MEASUREMENT_ID</code>
            ). Loaded only after you Accept analytics.
          </li>
          <li>
            <strong>PostHog</strong> — product analytics and client exception
            capture. Loaded only after you Accept analytics. If you Reject, we
            do not initialize analytics tools in your browser.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>Server-side abuse signal</h2>
        <p>
          To limit rapid creation of guest identities, Motif may compute a
          server-side HMAC from a coarse network prefix and user-agent family.
          This is not stored as a browser cookie and is not used for advertising.
        </p>
      </section>
    </LegalPageShell>
  );
}
