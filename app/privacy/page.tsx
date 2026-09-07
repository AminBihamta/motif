import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, SUPPORT_EMAIL } from "../components/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Motif collects, uses, and protects your images, taste profiles, and account data.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy policy" eyebrow="Legal / data">
      <p>Last updated: 7 September 2026.</p>

      <section className="space-y-3">
        <h2>Who we are</h2>
        <p>
          Motif (“we”, “us”) is an AI-powered visual taste product. You upload
          images you like; we analyze shared visual patterns and may help you
          find related products. For privacy questions or data requests, email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Images you upload</strong> — exactly six JPG or PNG files
            (each up to 5 MB) used as visual evidence for analysis.
          </li>
          <li>
            <strong>Taste profiles</strong> — AI-generated vibe names,
            descriptions, colors, characteristics, preference insights, and
            search hints stored in our database (Neon/Postgres).
          </li>
          <li>
            <strong>Account data</strong> — if you sign in: name, email, and
            authentication details via Auth.js (Google OAuth and/or
            email/password). Passwords are hashed server-side.
          </li>
          <li>
            <strong>Product search queries</strong> — object names you submit,
            combined with taste profile terms to query Amazon via SearchApi.
          </li>
          <li>
            <strong>Usage allowances</strong> — counts of analyses and searches
            remaining for guests and verified members.
          </li>
          <li>
            <strong>Technical signals</strong> — a server-side HMAC derived from
            a coarse network prefix and user-agent family to limit guest abuse.
            This is not a browser fingerprint and is not stored as a tracking
            cookie.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>How we use your data</h2>
        <ul>
          <li>To run multimodal image analysis through OpenRouter and return a taste profile.</li>
          <li>To store originals privately in Vercel Blob and show them back to you as evidence.</li>
          <li>To claim an anonymous profile to your account after sign-in when appropriate.</li>
          <li>To send email verification via Brevo for email/password accounts.</li>
          <li>To perform taste-shaped product search and show Amazon results.</li>
          <li>
            To measure product usage with Google Analytics and PostHog{" "}
            <em>only after</em> you opt in to analytics (see{" "}
            <Link href="/cookies">Cookies</Link>).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>Cookies and similar technologies</h2>
        <ul>
          <li>
            <strong>motif_anonymous_owner</strong> — HTTP-only cookie (about one
            year) that links your browser to an anonymous taste profile before
            you sign in. Necessary for the product to work.
          </li>
          <li>
            <strong>Auth.js session cookies</strong> — necessary if you sign in.
          </li>
          <li>
            <strong>Google Analytics</strong> — analytics cookies only if you
            Accept analytics.
          </li>
          <li>
            <strong>PostHog</strong> — analytics cookies / storage only if you
            Accept analytics. Reject keeps Motif working without analytics.
          </li>
        </ul>
        <p>
          Details and controls: <Link href="/cookies">Cookie policy</Link>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Image access and security</h2>
        <p>
          Uploaded evidence images are stored with private access. They are only
          exposed through our owner-checked proxy at{" "}
          <code className="text-motif-taupe">/api/taste-images/[id]</code>, which
          verifies your anonymous owner cookie or signed-in user before reading
          from Blob. API keys for OpenRouter, Blob, SearchApi, Brevo, and
          database access stay on the server.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Processors and subprocessors</h2>
        <p>
          Depending on features you use, data may be processed by Vercel
          (hosting), Neon (database), Vercel Blob (image storage), OpenRouter
          (AI analysis), SearchApi (Amazon search), Brevo (email), Google
          (OAuth), Google Analytics, and PostHog (analytics, if consented).
        </p>
      </section>

      <section className="space-y-3">
        <h2>Retention and deletion</h2>
        <p>
          Re-running analysis for the same owner replaces the previous profile
          and removes replaced image records and Blob objects where our cleanup
          succeeds. You may request access, correction, or deletion of personal
          data by emailing{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We may retain
          limited records needed for security, abuse prevention, or legal
          obligations.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Your choices</h2>
        <ul>
          <li>Use Motif as a guest with limited allowances, or create an account.</li>
          <li>Accept or reject analytics cookies at any time via the banner or <Link href="/cookies">Cookies</Link>.</li>
          <li>Contact us to exercise privacy rights available in your region.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>Changes</h2>
        <p>
          We may update this policy as Motif evolves. The “Last updated” date at
          the top will change when we do. Continued use after updates means you
          acknowledge the revised policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Contact</h2>
        <p>
          Privacy and support:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </section>
    </LegalPageShell>
  );
}
