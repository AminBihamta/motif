import type { Metadata } from "next";
import ContactForm from "../components/contact-form";
import { LegalPageShell, SUPPORT_EMAIL } from "../components/legal-page-shell";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send Motif a message about taste profiles, privacy, or support.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <LegalPageShell title="Contact" eyebrow="Support / enquiry">
      <p>
        Send a note about Motif, privacy requests, or anything else. You can
        also email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> directly.
      </p>

      <div className="max-w-xl border-2 border-motif-ivory bg-motif-charcoal p-5 shadow-[10px_10px_0_var(--color-motif-red)] sm:p-7">
        <ContactForm />
      </div>
    </LegalPageShell>
  );
}
