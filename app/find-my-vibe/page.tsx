import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import UploadForm from "../components/upload-form";
import { AmbientDecor, Reveal } from "../components/motion-elements";

export const metadata: Metadata = {
  title: "Find My Vibe — Motif",
  description: "Upload six images and decode your personal visual taste.",
};

export default function FindMyVibe() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-motif-black text-motif-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-[8%] top-0 w-px bg-motif-red/50" />

      <AmbientDecor className="pointer-events-none absolute -right-52 -top-52 hidden lg:block">
        <Image src="/assets/persian-rug-1.png" alt="" width={700} height={420} className="w-[40rem] rotate-12 opacity-75" />
      </AmbientDecor>
      <AmbientDecor delay={1.4} className="pointer-events-none absolute -bottom-28 -left-24 hidden md:block">
        <Image src="/assets/star.png" alt="" width={240} height={240} className="w-52 -rotate-12 opacity-80" />
      </AmbientDecor>

      <header className="relative z-30 flex min-h-16 items-stretch border-b-2 border-motif-ivory bg-motif-black">
        <Link href="/" className="bodoniModa flex items-center border-r-2 border-motif-ivory px-5 text-3xl font-black tracking-[-0.06em] transition-colors hover:bg-motif-ivory hover:text-motif-black focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red sm:px-8">
          Motif
        </Link>
        <p className="hidden flex-1 items-center px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-motif-taupe md:flex">
          Visual intake / six frames
        </p>
        <Link href="/" className="flex items-center border-l-2 border-motif-ivory px-4 text-[10px] font-black uppercase tracking-[0.18em] transition-colors hover:bg-motif-blue sm:px-6 sm:text-xs">
          Abort mission ×
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] max-w-[96rem] gap-14 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-20">
        <Reveal className="flex flex-col justify-between lg:col-span-5">
          <div>
            <div className="mb-7 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-motif-red">
              <span className="size-2 bg-motif-red" />
              Step 01 — provide the evidence
            </div>
            <h1 className="max-w-4xl text-[4rem] font-black uppercase leading-[0.76] tracking-[-0.075em] sm:text-[6rem] lg:text-[7.5rem]">
              Show us
              <span className="bodoniModa block font-normal italic normal-case text-motif-taupe">
                what pulls you in.
              </span>
            </h1>
            <p className="mt-9 max-w-lg border-l-[6px] border-motif-red pl-5 text-base leading-7 text-motif-ivory/70 sm:text-lg sm:leading-8">
              Pick six images you genuinely love. Interiors, clothes, art,
              objects—anything goes. Instinct beats strategy here.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 border-2 border-motif-ivory text-[10px] font-black uppercase tracking-[0.16em] lg:max-w-md">
            <div className="border-r-2 border-motif-ivory p-4">
              <span className="mb-2 block text-motif-red">Accepted</span>
              JPG + PNG
            </div>
            <div className="p-4">
              <span className="mb-2 block text-motif-red">Maximum</span>
              5 MB each
            </div>
          </div>
        </Reveal>

        <Reveal className="relative self-center lg:col-span-7" direction="right" delay={0.12}>
          <div className="absolute -right-3 -top-5 z-20 rotate-3 border-2 border-motif-black bg-motif-blue px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_var(--color-motif-ivory)] sm:right-5">
            Six clues. One profile.
          </div>
          <div className="border-2 border-motif-ivory bg-motif-charcoal p-3 shadow-[12px_12px_0_var(--color-motif-red)] sm:p-5">
            <UploadForm />
          </div>
        </Reveal>
      </div>

      <footer className="relative z-20 flex items-center justify-between border-t-2 border-motif-ivory bg-motif-red px-5 py-4 text-[9px] font-black uppercase tracking-[0.18em] sm:px-8 sm:text-[10px]">
        <span>No right answers</span>
        <span className="hidden sm:inline">Your images are analyzed together</span>
        <span>Trust your eye</span>
      </footer>
    </main>
  );
}
