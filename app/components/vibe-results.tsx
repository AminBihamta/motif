import { ArrowRight, Refresh, Search } from "iconoir-react";
import Link from "next/link";
import type { TasteProfile } from "../lib/taste-profile";
import { InsightRow, Reveal, TactileTag } from "./motion-elements";

const swatchClasses = [
  "bg-motif-red",
  "bg-motif-blue",
  "bg-motif-brass",
  "bg-motif-olive",
  "bg-motif-lavender",
];

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
            <span className="text-[10px] uppercase tracking-[0.2em] text-motif-taupe">
              Issue 001
            </span>
          </div>

          <h1 className="text-[4rem] font-black uppercase leading-[0.75] tracking-[-0.075em] sm:text-[6.5rem] lg:text-[8.5rem]">
            You&apos;re
            <br />
            giving
            <span className="bodoniModa relative mt-4 block w-fit max-w-full rotate-[-1deg] bg-motif-red px-3 pb-3 pt-1 font-normal normal-case leading-[0.82] tracking-[-0.06em] text-motif-ivory sm:px-5">
              {analysis.vibeName}
              <span aria-hidden="true" className="absolute -bottom-3 -right-3 size-6 bg-motif-blue" />
            </span>
          </h1>

          <div className="mt-10 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <p className="max-w-2xl border-l-[6px] border-motif-blue pl-5 text-lg leading-8 text-motif-ivory/80">
              {analysis.description}
            </p>
            <Link
              href="/find-my-vibe"
              className="inline-flex w-fit items-center gap-2 border-b-2 border-motif-ivory pb-1 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:border-motif-red hover:text-motif-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-ivory"
            >
              <Refresh aria-hidden="true" className="size-4" />
              Recalibrate
            </Link>
          </div>
        </div>

        <aside className="relative self-end border-2 border-motif-ivory bg-motif-ivory p-3 text-motif-black shadow-[10px_10px_0_var(--color-motif-blue)] lg:col-span-3 lg:rotate-2">
          <div className="mb-3 flex items-center justify-between border-b-2 border-motif-black pb-2">
            <h2 className="text-xs font-black uppercase tracking-[0.18em]">
              Color evidence
            </h2>
            <span className="bodoniModa text-2xl">✦</span>
          </div>
          <div>
            {analysis.colors.slice(0, 5).map((color, index) => (
              <div
                key={`${color}-${index}`}
                className="grid grid-cols-[3rem_1fr] items-stretch border-b border-motif-black last:border-b-0"
              >
                <span
                  aria-hidden="true"
                  className={`min-h-12 border-r border-motif-black ${
                    swatchClasses[index % swatchClasses.length]
                  }`}
                />
                <span className="flex items-center px-3 text-sm font-bold uppercase">
                  {color}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </Reveal>

      <section className="relative mt-24 border-y-2 border-motif-ivory py-11 sm:mt-36">
        <span className="absolute -top-4 left-0 bg-motif-black pr-4 text-xs font-black uppercase tracking-[0.26em] text-motif-red">
          The visual DNA
        </span>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-6">
          {analysis.characteristics.map((characteristic, index) => (
            <TactileTag
              key={`${characteristic}-${index}`}
              delay={index * 0.06}
              className="inline-block cursor-default border-2 border-motif-ivory bg-motif-charcoal px-5 py-3 text-lg font-bold uppercase shadow-[5px_5px_0_var(--color-motif-red)] sm:text-2xl"
            >
              {characteristic}
            </TactileTag>
          ))}
        </div>
      </section>

      <section className="mt-24 sm:mt-36" aria-labelledby="taste-heading">
        <div className="mb-10 grid gap-5 lg:grid-cols-12">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-motif-red lg:col-span-3">
            Read between
            <br />
            the images
          </p>
          <h2
            id="taste-heading"
            className="text-5xl font-black uppercase leading-[0.82] tracking-[-0.06em] sm:text-7xl lg:col-span-9 lg:text-8xl"
          >
            What your choices
            <span className="bodoniModa block font-normal italic text-motif-taupe">
              are really saying.
            </span>
          </h2>
        </div>

        <ol className="border-t-2 border-motif-ivory">
          {analysis.preferenceInsights.map((insight, index) => (
            <InsightRow
              key={`${insight}-${index}`}
              delay={index * 0.06}
              direction={index % 2 === 0 ? "left" : "right"}
              className={`group grid min-h-40 border-b-2 border-motif-ivory transition-colors duration-300 sm:grid-cols-[10rem_1fr] ${
                index % 2 === 1
                  ? "bg-motif-ivory text-motif-black"
                  : "hover:bg-motif-blue"
              }`}
            >
              <span className="bodoniModa flex items-center border-b-2 border-current px-5 py-3 text-6xl sm:border-b-0 sm:border-r-2 sm:text-8xl">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="flex max-w-4xl items-center px-5 py-7 text-lg leading-8 sm:px-10 sm:text-2xl sm:leading-9">
                {insight}
              </p>
            </InsightRow>
          ))}
        </ol>
      </section>

      <Reveal className="relative mt-24 border-2 border-motif-black bg-motif-blue p-5 text-motif-ivory shadow-[12px_12px_0_var(--color-motif-red)] sm:mt-36 sm:p-10 lg:p-14">
        <span className="absolute -right-3 -top-5 rotate-3 border-2 border-motif-black bg-motif-ivory px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-motif-black">
          Coming soon-ish
        </span>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.26em] text-motif-ivory/65">
              Taste → Object
            </p>
            <h2 className="text-5xl font-black uppercase leading-[0.82] tracking-[-0.06em] sm:text-7xl">
              Find things
              <span className="bodoniModa block font-normal italic text-motif-ivory">
                that get you.
              </span>
            </h2>
            <p className="mt-6 max-w-lg border-l-4 border-motif-red pl-4 leading-7 text-motif-ivory/80">
              Search for a chair, jacket, lamp—anything. Motif will use your
              visual profile to cut through the generic stuff.
            </p>
          </div>

          <div>
            <label
              htmlFor="taste-search"
              className="mb-3 block text-xs font-black uppercase tracking-[0.18em]"
            >
              What are we hunting for?
            </label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 size-6 -translate-y-1/2 text-motif-black"
                />
                <input
                  id="taste-search"
                  type="text"
                  defaultValue={analysis.searchQuery}
                  placeholder="Chair, jacket, lamp..."
                  disabled
                  aria-describedby="search-status"
                  className="w-full border-2 border-motif-black bg-motif-ivory py-4 pl-13 pr-5 text-lg font-bold text-motif-black opacity-90 outline-none"
                />
              </div>
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-between border-2 border-motif-black bg-motif-red px-5 py-4 font-black uppercase tracking-[0.12em] text-motif-ivory opacity-75"
              >
                Search my style
                <ArrowRight aria-hidden="true" className="size-6" />
              </button>
            </div>
            <p id="search-status" className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-motif-ivory/60">
              Product matching is currently being connected.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
