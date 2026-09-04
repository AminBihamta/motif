import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Spark } from "iconoir-react";
import HeroCollage from "../components/hero-collage";
import { Reveal } from "../components/motion-elements";
import MotifLogo from "../components/motif-logo";

export const metadata: Metadata = {
  title: "Motif — Find your vibe",
  description: "Find what you actually like using Motif!",
};

const heroCollagePools = [
  [
    {
      src: "/assets/style-references-commercial-partial-2/01-mid-century.jpg",
      alt: "Mid-century wall shelves packed with books and objects",
    },
    {
      src: "/assets/style-references-commercial-partial-2/03-mid-century.jpg",
      alt: "Mid-century room divider and lounge seating",
    },
    {
      src: "/assets/style-references-commercial-partial-2/04-mid-century.jpg",
      alt: "Mid-century interior with warm wood tones",
    },
    {
      src: "/assets/style-references-commercial-partial-2/02-mid-century.jpg",
      alt: "Mid-century living space detail",
    },
  ],
  [
    {
      src: "/assets/style-references-commercial-partial-2/23-scandinavian.jpg",
      alt: "Scandinavian table still life with flowers and a blue plate",
    },
    {
      src: "/assets/style-references-commercial-partial-2/29-scandinavian.jpg",
      alt: "Scandinavian interior with soft daylight",
    },
    {
      src: "/assets/style-references-commercial-partial-2/26-scandinavian.jpg",
      alt: "Scandinavian room with pale wood and linen",
    },
    {
      src: "/assets/style-references-commercial-partial-2/30-scandinavian.jpg",
      alt: "Scandinavian still life and soft textures",
    },
  ],
  [
    {
      src: "/assets/style-references-commercial-partial-2/18-brutalist.jpg",
      alt: "Brutalist tower facades shot from below",
    },
    {
      src: "/assets/style-references-commercial-partial-2/17-brutalist.jpg",
      alt: "Brutalist concrete architecture",
    },
    {
      src: "/assets/style-references-commercial-partial-2/19-brutalist.jpg",
      alt: "Brutalist building geometry and shadow",
    },
    {
      src: "/assets/style-references-commercial-partial-2/20-brutalist.jpg",
      alt: "Brutalist facade detail",
    },
  ],
  [
    {
      src: "/assets/style-references/40-art-deco.jpg",
      alt: "Art Deco staircase with a red carpet runner",
    },
    {
      src: "/assets/style-references-commercial-partial-2/13-art-deco.jpg",
      alt: "Art Deco interior detail",
    },
    {
      src: "/assets/style-references-commercial-partial-2/14-art-deco.jpg",
      alt: "Art Deco architectural ornament",
    },
    {
      src: "/assets/style-references-commercial-partial-2/15-art-deco.jpg",
      alt: "Art Deco room with marble and mural",
    },
  ],
];

const productPreviews = [
  {
    src: "/assets/product-previews/chair.png",
    alt: "Lounge chair",
  },
  {
    src: "/assets/product-previews/lamp.png",
    alt: "Table lamp",
  },
  {
    src: "/assets/product-previews/jacket.png",
    alt: "Tailored jacket",
  },
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
    title: "Shop with your taste",
    body: "Get a sharp profile — then search any object and Motif filters live results through your visual DNA.",
  },
];

function PrimaryCta({
  href = "/find-my-vibe",
  children,
  className = "",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex w-fit items-center gap-5 border-2 border-motif-ivory bg-motif-red px-5 py-4 text-sm font-black uppercase tracking-[0.12em] shadow-[7px_7px_0_var(--color-motif-blue)] transition-transform hover:-translate-y-1 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-red motion-reduce:transform-none ${className}`}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
      />
    </Link>
  );
}

export default function BoldHome() {
  return (
    <main className="relative overflow-hidden bg-motif-black text-motif-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]"
      />

      <header className="relative z-30 flex min-h-16 items-stretch border-b-2 border-motif-ivory bg-motif-black">
        <Link
          href="/dev-home"
          className="group flex items-center border-r-2 border-motif-ivory px-5 transition-colors hover:bg-motif-ivory focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-red sm:px-8"
        >
          <MotifLogo
            className="h-7 w-auto transition group-hover:brightness-0 sm:h-8"
            priority
          />
        </Link>
        <p className="hidden flex-1 items-center px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-motif-taupe md:flex">
          Taste is not a trend report
        </p>
        <Link
          href="/find-my-vibe"
          className="flex items-center border-l-2 border-motif-ivory bg-motif-red px-4 text-[10px] font-black uppercase tracking-[0.18em] transition-colors hover:bg-motif-ivory hover:text-motif-red focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-motif-black sm:px-6 sm:text-xs"
        >
          Find my vibe ↗
        </Link>
      </header>

      <section className="relative z-10 min-h-[calc(100svh-4rem)] border-b-2 border-motif-ivory">
        <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Reveal className="relative z-10 flex flex-col justify-center px-5 py-14 sm:px-10 lg:px-14 lg:py-20 xl:px-20">
            <h1 className="max-w-4xl text-[3.4rem] font-black uppercase leading-[0.78] tracking-[-0.08em] sm:text-[5.5rem] lg:text-[7rem] xl:text-[8.25rem] -mr-4">
              Your taste
              <span className="bodoniModa block font-normal italic normal-case text-motif-taupe">
                has a pattern.
              </span>
            </h1>

            <div className="mt-10 max-w-xl  mt-20">
              <p className="text-base leading-7 text-motif-ivory/75 sm:text-lg sm:leading-8">
                Find what you actually like using Motif!
              </p>
              <PrimaryCta className="mt-8">Find my vibe</PrimaryCta>
            </div>
          </Reveal>

          <HeroCollage pools={[...heroCollagePools]} />
        </div>
      </section>

      <section className="relative z-10 border-b-2 border-motif-ivory bg-motif-blue px-4 py-16 text-motif-ivory sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[96rem]">
          <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:items-center lg:gap-14">
            <div>
              <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-motif-ivory/70">
                What Motif returns
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-motif-red">
                Sample profile
              </p>
              <h2 className="mt-3 max-w-xl text-4xl font-black uppercase leading-[0.88] tracking-[-0.05em] sm:text-6xl">
                Opulent
                <span className="bodoniModa mt-2 block font-normal italic normal-case text-motif-ivory">
                  Maximalism.
                </span>
              </h2>
              <p className="mt-6 max-w-md border-l-[6px] border-motif-red pl-5 text-base leading-7 text-motif-ivory/80">
                A named vibe, color DNA, and traits you can actually shop with —
                not another vague aesthetic quiz result.
              </p>
              <Link
                href="/find-my-vibe"
                className="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-motif-ivory underline decoration-motif-red decoration-2 underline-offset-4 transition-colors hover:text-motif-red"
              >
                Decode yours{" "}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>

            <div className="relative overflow-hidden border-2 border-motif-black bg-motif-black shadow-[12px_12px_0_var(--color-motif-black)]">
              <Image
                src="/assets/marketing/my-vibe-result.png"
                alt="Example Motif vibe results page showing Opulent Maximalism with color analysis and visual DNA"
                width={1600}
                height={1200}
                className="h-auto w-full"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 bg-motif-ivory px-4 py-20 text-motif-black sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[96rem]">
          <Reveal>
            <h2 className="text-5xl font-black uppercase leading-[0.82] tracking-[-0.065em] sm:text-7xl lg:text-9xl">
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

          <Reveal
            delay={0.2}
            className="mt-10 flex justify-center sm:justify-start"
          >
            <Link
              href="/find-my-vibe"
              className="group inline-flex w-fit items-center gap-5 border-2 border-motif-black bg-motif-red px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-motif-ivory shadow-[7px_7px_0_var(--color-motif-black)] transition-transform hover:-translate-y-1 hover:translate-x-1 hover:bg-motif-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-red motion-reduce:transform-none"
            >
              Start with six images
              <ArrowRight
                aria-hidden="true"
                className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden border-y-2 border-motif-ivory bg-motif-black px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-[18%] hidden w-px bg-motif-ivory/15 lg:block"
        />
        <div className="relative mx-auto grid max-w-[96rem] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-motif-red">
              Taste → object
            </p>
            <h2 className="max-w-2xl text-5xl font-black uppercase leading-[0.84] tracking-[-0.06em] sm:text-7xl">
              Find things
              <span className="bodoniModa block font-normal italic normal-case text-motif-taupe">
                that get you.
              </span>
            </h2>
            <p className="mt-6 max-w-lg border-l-[6px] border-motif-red pl-5 text-base leading-7 text-motif-ivory/75 sm:text-lg sm:leading-8">
              Once your profile exists, search any object. Motif blends your
              visual DNA with live shopping results for the closest fit.
            </p>
            <PrimaryCta className="mt-8">Find my vibe</PrimaryCta>
          </Reveal>

          <Reveal delay={0.12} className="grid grid-cols-3 gap-3 sm:gap-4">
            {productPreviews.map((item, index) => (
              <div
                key={item.src}
                className={`relative aspect-[4/5] overflow-hidden border-2 border-motif-ivory bg-motif-ivory shadow-[5px_5px_0_var(--color-motif-red)] ${
                  index === 1 ? "translate-y-4 sm:translate-y-6" : ""
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1024px) 30vw, 12vw"
                  className="object-cover"
                />
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-4 py-24 sm:px-8 lg:px-12 lg:py-32">
        <Image
          aria-hidden="true"
          src="/assets/star.png"
          alt=""
          width={240}
          height={240}
          className="pointer-events-none absolute -left-20 top-8 w-44 -rotate-12 opacity-70 sm:w-56"
        />
        <Reveal className="relative mx-auto max-w-6xl border-2 border-motif-ivory bg-motif-black px-5 py-16 text-center shadow-[12px_12px_0_var(--color-motif-red)] sm:px-12 sm:py-24">
          <h2 className="text-5xl font-black uppercase leading-[0.8] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
            Stop saying
            <span className="bodoniModa block font-normal italic normal-case text-motif-taupe">
              “I&apos;ll know it when I see it.”
            </span>
          </h2>
          <div className="mt-10 flex flex-col items-center">
            <Link
              href="/find-my-vibe"
              className="inline-flex items-center justify-center gap-3 border-2 border-motif-red bg-motif-red px-6 py-4 text-sm font-black uppercase tracking-[0.13em] transition-colors hover:border-motif-ivory hover:bg-motif-ivory hover:text-motif-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-red"
            >
              Find my vibe <ArrowRight aria-hidden="true" className="size-5" />
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
          href="/find-my-vibe"
          className="border-t-0 border-motif-ivory px-5 py-5 text-right transition-colors hover:bg-motif-ivory hover:text-motif-red sm:border-l-2"
        >
          Find my vibe ↗
        </Link>
      </footer>
    </main>
  );
}
