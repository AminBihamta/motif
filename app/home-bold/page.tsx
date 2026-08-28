import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Spark } from "iconoir-react";
import {
  AmbientDecor,
  CollageCard,
  Reveal,
  TactileTag,
} from "../components/motion-elements";

export const metadata: Metadata = {
  title: "Motif — Bold Homepage Concept",
  description: "An alternative editorial homepage concept for Motif.",
};

const heroImages = [
  "/assets/style-references/01-mid-century.jpg",
  "/assets/style-references/14-bohemian.jpg",
  "/assets/style-references/27-bauhaus.jpg",
  "/assets/style-references/36-art-deco.jpg",
];

const tasteWords = [
  "Warm minimalism",
  "Unpolished edges",
  "Soft geometry",
  "Useful weirdness",
];

const steps = [
  {
    number: "01",
    title: "Drop the evidence",
    body: "Choose six images you cannot stop looking at. No mood-board expertise required.",
  },
  {
    number: "02",
    title: "We read the room",
    body: "Motif spots the colors, forms, energy and recurring visual instincts hiding in plain sight.",
  },
  {
    number: "03",
    title: "Meet your taste",
    body: "Get a sharp, personal profile that turns vague preferences into a visual language you can use.",
  },
];

export default function BoldHome() {
  return (
    <main className="relative overflow-hidden bg-motif-black text-motif-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]"
      />

      <header className="relative z-30 flex min-h-16 items-stretch border-b-2 border-motif-ivory bg-motif-black">
        <Link
          href="/"
          className="bodoniModa flex items-center border-r-2 border-motif-ivory px-5 text-3xl font-black tracking-[-0.06em] transition-colors hover:bg-motif-ivory hover:text-motif-black focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red sm:px-8"
        >
          Motif
        </Link>
        <p className="hidden flex-1 items-center px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-motif-taupe md:flex">
          Taste is not a trend report
        </p>
        <Link
          href="/home-original"
          className="flex items-center border-l-2 border-motif-ivory px-4 text-[10px] font-black uppercase tracking-[0.18em] transition-colors hover:bg-motif-blue sm:px-6 sm:text-xs"
        >
          View original ↗
        </Link>
      </header>

      <section className="relative z-10 min-h-[calc(100svh-4rem)] border-b-2 border-motif-ivory px-4 pb-10 pt-12 sm:px-8 lg:px-12 lg:pb-16 lg:pt-16">
        <AmbientDecor className="pointer-events-none absolute -right-52 -top-44 hidden xl:block">
          <Image
            src="/assets/persian-rug-1.png"
            alt=""
            width={700}
            height={420}
            className="w-[42rem] rotate-12 opacity-80"
          />
        </AmbientDecor>

        <div className="mx-auto grid max-w-[96rem] gap-10 lg:grid-cols-12 lg:gap-4">
          <Reveal className="relative z-10 lg:col-span-8">
            <div className="mb-7 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.24em] text-motif-red">
              <span className="size-2 bg-motif-red" />
              AI-powered visual taste decoder
            </div>

            <h1 className="max-w-6xl text-[4.2rem] font-black uppercase leading-[0.74] tracking-[-0.08em] sm:text-[7rem] lg:text-[9rem] xl:text-[11rem]">
              Your taste
              <span className="bodoniModa block font-normal italic normal-case text-motif-taupe">
                has a pattern.
              </span>
            </h1>

            <div className="mt-10 grid max-w-4xl gap-7 border-l-[7px] border-motif-red pl-5 sm:grid-cols-[1fr_auto] sm:items-end sm:pl-7">
              <p className="max-w-xl text-base leading-7 text-motif-ivory/75 sm:text-lg sm:leading-8">
                Feed Motif six images. Get back the visual language you have
                been speaking without knowing its name.
              </p>
              <Link
                href="/find-my-vibe"
                className="group inline-flex w-fit items-center gap-5 border-2 border-motif-ivory bg-motif-red px-5 py-4 text-sm font-black uppercase tracking-[0.12em] shadow-[7px_7px_0_var(--color-motif-blue)] transition-transform hover:-translate-y-1 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-red motion-reduce:transform-none"
              >
                Find my vibe
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                />
              </Link>
            </div>
          </Reveal>

          <Reveal
            className="relative grid min-h-[31rem] grid-cols-2 grid-rows-2 gap-2 lg:col-span-4 lg:mt-24"
            direction="right"
            delay={0.12}
          >
            {heroImages.map((src, index) => (
              <CollageCard
                key={src}
                delay={0.18 + index * 0.07}
                className={`group relative overflow-hidden border-2 border-motif-ivory ${
                  index === 0 ? "mt-8" : ""
                } ${index === 3 ? "-mt-8 mb-8" : ""}`}
              >
                <Image
                  src={src}
                  alt="Eclectic visual inspiration"
                  fill
                  sizes="(max-width: 1024px) 50vw, 18vw"
                  className="object-cover grayscale-[0.2] transition duration-500 group-hover:scale-110 group-hover:grayscale-0 motion-reduce:transition-none"
                />
                <span className="absolute bottom-0 left-0 bg-motif-ivory px-2 py-1 text-[9px] font-black text-motif-black">
                  0{index + 1}
                </span>
              </CollageCard>
            ))}
            <span className="absolute -left-6 top-1/2 z-10 -translate-y-1/2 rotate-[-7deg] bg-motif-blue px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">
              Look closer
            </span>
          </Reveal>
        </div>

        <div className="mx-auto mt-16 flex max-w-[96rem] items-center justify-between border-t-2 border-motif-ivory pt-4 text-[10px] font-bold uppercase tracking-[0.24em] text-motif-taupe">
          <span>Scroll to decode</span>
          <span className="hidden sm:inline">Not a quiz. Not a horoscope.</span>
          <span>↓ 01</span>
        </div>
      </section>

      <section className="relative z-10 bg-motif-ivory px-4 py-20 text-motif-black sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[96rem]">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-motif-red lg:col-span-3">
              The anti-algorithm
              <br /> algorithm
            </p>
            <h2 className="text-5xl font-black uppercase leading-[0.82] tracking-[-0.065em] sm:text-7xl lg:col-span-9 lg:text-9xl">
              Less generic.
              <span className="bodoniModa block font-normal italic normal-case text-motif-blue">
                More unmistakably you.
              </span>
            </h2>
          </Reveal>

          <div className="mt-16 grid border-2 border-motif-black lg:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal
                key={step.number}
                delay={index * 0.1}
                className="group relative min-h-80 border-b-2 border-motif-black p-6 transition-colors hover:bg-motif-red hover:text-motif-ivory lg:border-b-0 lg:border-r-2 lg:last:border-r-0 sm:p-8"
              >
                <span className="bodoniModa text-7xl leading-none text-motif-taupe transition-colors group-hover:text-motif-ivory/50">
                  {step.number}
                </span>
                <div className="mt-16">
                  <h3 className="text-2xl font-black uppercase tracking-[-0.04em]">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-sm leading-7 opacity-70">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-y-2 border-motif-ivory bg-motif-blue py-16 sm:py-24">
        <div className="absolute inset-y-0 left-1/2 w-px bg-motif-ivory/20" />
        <Reveal className="relative mx-auto max-w-[96rem] px-4 sm:px-8 lg:px-12">
          <p className="mb-10 text-center text-xs font-black uppercase tracking-[0.28em] text-motif-ivory/60">
            A taste profile might read
          </p>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
            {tasteWords.map((word, index) => (
              <TactileTag
                key={word}
                delay={index * 0.08}
                className="cursor-default border-2 border-motif-black bg-motif-ivory px-5 py-3 text-xl font-black uppercase text-motif-black shadow-[7px_7px_0_var(--color-motif-red)] sm:px-7 sm:py-4 sm:text-3xl"
              >
                {word}
              </TactileTag>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-4 py-24 sm:px-8 lg:px-12 lg:py-36">
        <Image
          aria-hidden="true"
          src="/assets/star.png"
          alt=""
          width={240}
          height={240}
          className="pointer-events-none absolute -left-20 top-8 w-44 -rotate-12 opacity-70 sm:w-56"
        />
        <Reveal className="relative mx-auto max-w-5xl border-2 border-motif-ivory bg-motif-black px-5 py-16 text-center shadow-[12px_12px_0_var(--color-motif-red)] sm:px-12 sm:py-24">
          <span className="mx-auto mb-7 flex size-12 items-center justify-center rounded-full bg-motif-red">
            <Spark aria-hidden="true" className="size-6" />
          </span>
          <h2 className="text-5xl font-black uppercase leading-[0.8] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
            Stop saying
            <span className="bodoniModa block font-normal italic normal-case text-motif-taupe">
              “I&apos;ll know it when I see it.”
            </span>
          </h2>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/find-my-vibe"
              className="inline-flex items-center justify-center gap-3 border-2 border-motif-red bg-motif-red px-6 py-4 text-sm font-black uppercase tracking-[0.13em] transition-colors hover:border-motif-ivory hover:bg-motif-ivory hover:text-motif-red"
            >
              Decode my taste <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
            <Link
              href="/home-original"
              className="inline-flex items-center justify-center gap-3 border-2 border-motif-ivory px-6 py-4 text-sm font-black uppercase tracking-[0.13em] transition-colors hover:bg-motif-ivory hover:text-motif-black"
            >
              <Play aria-hidden="true" className="size-5" /> Watch demo
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="relative z-10 grid border-t-2 border-motif-ivory bg-motif-red text-[10px] font-black uppercase tracking-[0.2em] sm:grid-cols-3">
        <span className="border-b-2 border-motif-ivory px-5 py-5 sm:border-b-0 sm:border-r-2">
          Motif © 2026
        </span>
        <span className="hidden items-center justify-center sm:flex">
          Your taste, translated
        </span>
        <Link
          href="/home-original"
          className="border-t-0 border-motif-ivory px-5 py-5 text-right transition-colors hover:bg-motif-ivory hover:text-motif-red sm:border-l-2"
        >
          Back to original ↗
        </Link>
      </footer>
    </main>
  );
}
