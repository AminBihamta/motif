import type { ReactNode } from "react";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

export const SUPPORT_EMAIL = "aminbihamtawork@gmail.com";

export function LegalPageShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-motif-black text-motif-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]"
      />

      <SiteHeader priority />

      <article className="relative z-10 mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-motif-red">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-[0.82] tracking-[-0.065em] sm:text-7xl">
          {title}
        </h1>
        <p className="mt-6 border-l-[6px] border-motif-red pl-5 text-sm leading-7 text-motif-ivory/70">
          Questions or data requests:{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-bold text-motif-ivory underline decoration-motif-red decoration-2 underline-offset-4"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
        <div className="mt-12 space-y-10 text-base leading-7 text-motif-ivory/80 [&_h2]:text-xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:tracking-[-0.04em] [&_h2]:text-motif-ivory [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_a]:font-bold [&_a]:text-motif-ivory [&_a]:underline [&_a]:decoration-motif-red [&_a]:decoration-2 [&_a]:underline-offset-4">
          {children}
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
