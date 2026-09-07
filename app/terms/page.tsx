import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell, SUPPORT_EMAIL } from "../components/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "Terms for using Motif’s taste analysis and product discovery features.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of use" eyebrow="Legal / terms">
      <p>Last updated: 7 September 2026.</p>

      <section className="space-y-3">
        <h2>Agreement</h2>
        <p>
          By using Motif you agree to these Terms and our{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do
          not use the service. Questions:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>The service</h2>
        <p>
          Motif analyzes images you provide to produce a visual taste profile
          and may help you search for related products. Features, models, and
          allowances may change as we improve the product.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Accounts and allowances</h2>
        <ul>
          <li>
            Guests receive a limited number of analyses and product searches
            without creating an account.
          </li>
          <li>
            Verified members receive a higher weekly allowance after email
            verification (or equivalent verified Google sign-in where
            applicable).
          </li>
          <li>
            You are responsible for keeping account credentials secure and for
            activity under your account.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>Acceptable use</h2>
        <ul>
          <li>Upload only images you have the right to use.</li>
          <li>Do not upload illegal, harmful, or infringing content.</li>
          <li>
            Do not attempt to bypass usage limits, abuse APIs, scrape the
            service, or disrupt Motif or its providers.
          </li>
          <li>
            Do not use Motif to build a competing dataset by systematically
            extracting outputs at scale.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>AI output disclaimer</h2>
        <p>
          Taste names, insights, colors, and product matches are generated or
          assisted by machine learning. They are approximate, editorial, and
          may be incomplete or wrong. Motif is not a substitute for professional
          advice and does not guarantee that products will match your taste or
          expectations.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Amazon and third-party shopping</h2>
        <p>
          Product results may link to Amazon or other merchants. Purchases
          happen on those sites under their terms. Motif does not sell the
          listed products, set their prices, or control availability. Prices and
          stock can change. Motif does not use affiliate or sponsored product
          links. See also our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Intellectual property</h2>
        <p>
          Motif’s branding, interface, and software are ours or our licensors’.
          You retain rights in images you upload; you grant us a limited
          license to process, store, and display them as needed to operate the
          service for you.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Availability</h2>
        <p>
          We aim for reliable uptime but do not guarantee uninterrupted access.
          AI providers, storage, search, or email services may fail or rate-limit
          requests.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Motif and its operators are
          not liable for indirect, incidental, special, consequential, or
          punitive damages, or for lost profits, data, or goodwill arising from
          your use of the service. Our total liability for any claim relating to
          Motif will not exceed the greater of (a) amounts you paid us for Motif
          in the three months before the claim, or (b) one hundred US dollars
          (or local equivalent), except where liability cannot be limited under
          applicable law.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Termination</h2>
        <p>
          We may suspend or terminate access if you violate these Terms or abuse
          the service. You may stop using Motif at any time and request account
          or data deletion via{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Changes</h2>
        <p>
          We may update these Terms. The “Last updated” date will change when
          we do. Continued use after changes constitutes acceptance of the
          updated Terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Contact</h2>
        <p>
          Support: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </section>
    </LegalPageShell>
  );
}
