import { ArrowRight } from "iconoir-react";
import Link from "next/link";
import type { TasteProfile } from "../lib/taste-profile";
import { Reveal, TactileTag } from "./motion-elements";

const namedColorHex: Record<string, string> = {
  emerald: "#046307",
  green: "#2F6B3A",
  burgundy: "#6E0F1A",
  red: "#8A050B",
  gold: "#C5A35A",
  antique: "#B8963E",
  brass: "#A77A3D",
  cream: "#E8DDC8",
  marble: "#D9D2C3",
  ivory: "#E8DDC8",
  black: "#15130F",
  blue: "#174A7E",
  navy: "#173858",
  olive: "#69705A",
  lavender: "#948492",
  walnut: "#60412E",
  taupe: "#A28D73",
  bronze: "#8C6A3B",
  copper: "#B87333",
  silver: "#C0C0C0",
  white: "#F5F0E6",
  pink: "#C97B84",
  orange: "#C56A2B",
  yellow: "#D4B45A",
  purple: "#6B4C7A",
  teal: "#2A6F6A",
  charcoal: "#29251F",
};

function extractHex(color: string) {
  const match = color.match(/#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/);
  if (!match) return null;
  const raw = match[1];
  if (raw.length === 3) {
    return `#${raw
      .split("")
      .map((char) => `${char}${char}`)
      .join("")
      .toUpperCase()}`;
  }
  return `#${raw.toUpperCase()}`;
}

function colorLabel(color: string) {
  return color.replace(/\s*\(?(#[0-9A-Fa-f]{3,8})\)?\s*/g, " ").replace(/\s+/g, " ").trim();
}

function colorToHex(color: string) {
  const explicit = extractHex(color);
  if (explicit) return explicit;

  const tokens = color.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  for (const token of tokens) {
    if (namedColorHex[token]) return namedColorHex[token];
  }

  return "#A28D73";
}

export default function VibeResults({
  analysis,
}: {
  analysis: TasteProfile | null;
}) {

  if (!analysis) {
    return (
      <Reveal className="relative mx-auto flex min-h-[68vh] max-w-4xl flex-col justify-center border-x-2 border-motif-ivory px-6 py-20 sm:px-12">
        <span className="absolute right-4 top-4 bg-motif-blue px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]">
          Error 404 / taste
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-motif-red">
          No signal detected
        </p>
        <h1 className="mt-4 text-6xl font-black uppercase leading-[0.8] tracking-[-0.07em] sm:text-8xl lg:text-9xl">
          Your vibe is
          <span className="bodoniModa block font-normal italic text-motif-ivory">
            still hiding.
          </span>
        </h1>
        <p className="mt-8 max-w-lg border-l-4 border-motif-red pl-5 text-base leading-7 text-motif-ivory/75">
          Give us six images you cannot stop thinking about. We&apos;ll find
          the visual code running through them.
        </p>
        <Link
          href="/find-my-vibe"
          className="mt-10 inline-flex w-fit items-center gap-3 border-2 border-motif-ivory bg-motif-red px-6 py-3 font-bold uppercase tracking-[0.12em] shadow-[7px_7px_0_var(--color-motif-ivory)] transition-transform hover:-translate-y-1 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-red motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
        >
          Decode my taste
          <ArrowRight aria-hidden="true" className="size-5" />
        </Link>
      </Reveal>
    );
  }

  return (
    <div>
      <Reveal className="relative grid gap-12 lg:grid-cols-12 lg:gap-5">
        <div className="lg:col-span-9">
          <div className="mb-5 flex items-center gap-3">
            <span className="bg-motif-red px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
              Analysis complete
            </span>
            <span className="h-px flex-1 bg-motif-ivory/35" />
          </div>

          <h1 className="text-[4rem] font-black uppercase leading-[0.75] tracking-[-0.075em] sm:text-[6.5rem] lg:text-[8.5rem]">
            You&apos;re
            <br />
            giving
            <span className="bodoniModa relative mt-4 block w-fit max-w-full rotate-[-1deg] bg-motif-red px-3 pb-3 pt-1 font-normal normal-case leading-[0.82] tracking-[-0.06em] text-motif-ivory sm:px-5">
              {analysis.vibeName}
            </span>
          </h1>
        </div>

        <aside className="relative self-end border-2 border-motif-ivory bg-motif-ivory p-3 text-motif-black shadow-[10px_10px_0_var(--color-motif-blue)] lg:col-span-3 lg:rotate-2">
          <div className="mb-3 border-b-2 border-motif-black pb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.18em]">
              Color analysis
            </h2>
          </div>
          <div>
            {analysis.colors.slice(0, 5).map((color, index) => {
              const hex = colorToHex(color);
              const label = colorLabel(color);

              return (
                <div
                  key={`${color}-${index}`}
                  className="grid grid-cols-[3rem_1fr] items-stretch border-b border-motif-black last:border-b-0"
                >
                  <span
                    aria-hidden="true"
                    className="min-h-12 border-x border-motif-black"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="flex flex-col justify-center gap-0.5 px-3 py-2">
                    <span className="text-sm font-bold uppercase leading-tight">
                      {label}
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-motif-black/55">
                      {hex}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="mt-6 lg:col-span-12 lg:mt-10">
          <p className="w-full border-l-[6px] border-motif-blue pl-5 text-lg leading-8 text-motif-ivory/80">
            {analysis.description}
          </p>
        </div>
      </Reveal>

      <section className="relative mt-28 border-b border-motif-ivory pb-11 sm:mt-40">
        <div className="mb-8 flex items-center gap-3">
          <span className="bg-motif-red px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
            The visual DNA
          </span>
          <span className="h-px flex-1 bg-motif-ivory/35" />
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-6">
          {analysis.characteristics.map((characteristic, index) => (
            <TactileTag
              key={`${characteristic}-${index}`}
              delay={index * 0.06}
              className="inline-block cursor-default border-2 border-motif-ivory bg-motif-charcoal px-5 py-3 text-lg font-bold uppercase text-motif-ivory shadow-[5px_5px_0_var(--color-motif-red)] sm:text-2xl"
            >
              {characteristic}
            </TactileTag>
          ))}
        </div>
      </section>
    </div>
  );
}
