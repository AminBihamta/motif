import type { Metadata } from "next";
import Image from "next/image";
import {
  AmbientDecor,
  CollageCard,
  Reveal,
  TactileTag,
} from "./components/motion-elements";
import MotifLogo from "./components/motif-logo";

export const metadata: Metadata = {
  title: "Motif — Coming Soon",
  description:
    "Motif turns the images you love into a visual language. Coming soon.",
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

export default function ComingSoonHome() {
  return (
    <main className="relative overflow-hidden bg-motif-black text-motif-ivory">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:38px_38px]"
      />

      <header className="relative z-30 flex min-h-16 items-stretch border-b-2 border-motif-ivory bg-motif-black">
        <div className="flex items-center border-r-2 border-motif-ivory px-5 sm:px-8">
          <MotifLogo className="h-7 w-auto sm:h-8" priority />
        </div>
        <p className="hidden flex-1 items-center px-6 text-[10px] font-bold uppercase tracking-[0.3em] text-motif-taupe md:flex">
          Taste is not a trend report
        </p>
        <p className="flex items-center border-l-2 border-motif-ivory bg-motif-red px-4 text-[10px] font-black uppercase tracking-[0.18em] sm:px-6 sm:text-xs">
          Coming soon
        </p>
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


            <h1 className="max-w-6xl text-[4.2rem] font-black uppercase leading-[0.74] tracking-[-0.08em] sm:text-[7rem] lg:text-[9rem] xl:text-[11rem]">
              Your taste
              <span className="bodoniModa block font-normal italic normal-case text-motif-taupe">
                has a pattern.
              </span>
            </h1>

            <div className="mt-10 max-w-4xl border-l-[7px] border-motif-red pl-5 sm:pl-7">
              <p className="max-w-xl text-base leading-7 text-motif-ivory/75 sm:text-lg sm:leading-8">
                Motif reads six images you cannot stop looking at — then names
                the visual language you have been speaking without knowing its
                name. What if finding things started from that?
              </p>
              <p className="mt-8 inline-flex w-fit items-center gap-5 border-2 border-motif-ivory bg-motif-blue px-5 py-4 text-sm font-black uppercase tracking-[0.12em] shadow-[7px_7px_0_var(--color-motif-red)]">
                Opening soon
              </p>
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
          <span>Not a quiz</span>
          <span className="hidden sm:inline">Not a horoscope</span>
          <span>A visual language</span>
        </div>
      </section>

      <section className="relative z-10 bg-motif-ivory px-4 py-20 text-motif-black sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[96rem]">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-motif-red lg:col-span-3">
              What Motif does
            </p>
            <h2 className="text-5xl font-black uppercase leading-[0.82] tracking-[-0.065em] sm:text-7xl lg:col-span-9 lg:text-8xl">
              Less generic.
              <span className="bodoniModa block font-normal italic normal-case text-motif-blue">
                More unmistakably you.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-12 max-w-2xl border-l-[6px] border-motif-red pl-5">
            <p className="text-base leading-7 text-motif-black/70 sm:text-lg sm:leading-8">
              You already know what you like. Motif turns that instinct into a
              sharp taste profile — colors, forms, atmosphere — then uses it to
              hunt for objects that actually fit.
            </p>
          </Reveal>
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

      <footer className="relative z-10 grid border-t-2 border-motif-ivory bg-motif-red text-[10px] font-black uppercase tracking-[0.2em] sm:grid-cols-3">
        <span className="border-b-2 border-motif-ivory px-5 py-5 sm:border-b-0 sm:border-r-2">
          Motif © 2026
        </span>
        <span className="hidden items-center justify-center sm:flex">
          Your taste, translated
        </span>
        <span className="border-t-0 px-5 py-5 text-right sm:border-l-2 sm:border-motif-ivory">
          Coming soon
        </span>
      </footer>
    </main>
  );
}
