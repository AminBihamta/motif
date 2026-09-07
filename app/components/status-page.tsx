import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "iconoir-react";
import SiteHeader from "./site-header";

export function StatusPage({
  code,
  eyebrow,
  title,
  italic,
  description,
  actions,
}: {
  code: string;
  eyebrow: string;
  title: string;
  italic: string;
  description: string;
  actions: ReactNode;
}) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-motif-black text-motif-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[11%] top-0 h-full w-px bg-motif-red/45"
      />

      <SiteHeader priority />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col justify-center px-5 py-16 sm:px-10 lg:px-16">
        <div className="relative border-x-2 border-motif-ivory px-6 py-14 sm:px-12 sm:py-20">
          <span className="absolute right-4 top-4 bg-motif-blue px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-motif-ivory sm:right-6 sm:top-6">
            {code}
          </span>

          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-motif-red">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black uppercase leading-[0.82] tracking-[-0.07em] sm:text-7xl lg:text-8xl">
            {title}
            <span className="bodoniModa mt-2 block font-normal italic normal-case text-motif-taupe">
              {italic}
            </span>
          </h1>
          <p className="mt-8 max-w-lg border-l-[6px] border-motif-red pl-5 text-base leading-7 text-motif-ivory/75">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">{actions}</div>
        </div>
      </div>
    </main>
  );
}

export function StatusPrimaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex w-fit items-center gap-3 border-2 border-motif-ivory bg-motif-red px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-motif-ivory shadow-[7px_7px_0_var(--color-motif-blue)] transition-transform hover:-translate-y-1 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-red motion-reduce:transform-none"
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
      />
    </Link>
  );
}

export function StatusSecondaryLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center border-2 border-motif-ivory bg-transparent px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-motif-ivory transition-colors hover:bg-motif-ivory hover:text-motif-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-red"
    >
      {children}
    </Link>
  );
}

export function StatusRetryButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex w-fit cursor-pointer items-center gap-3 border-2 border-motif-ivory bg-motif-red px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-motif-ivory shadow-[7px_7px_0_var(--color-motif-blue)] transition-transform hover:-translate-y-1 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-red motion-reduce:transform-none"
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
      />
    </button>
  );
}
