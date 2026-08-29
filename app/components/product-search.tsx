"use client";

import { ArrowRight, Search } from "iconoir-react";
import { useReducedMotion } from "motion/react";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchProducts } from "../my-vibe/actions";
import type { ProductSearchState } from "../my-vibe/actions";

const initialProductSearchState: ProductSearchState = {
  status: "idle",
  message: "Type an object. Motif will add your taste profile behind the scenes.",
  query: "",
  products: [],
};

const loadingMessages = [
  "Reading the market...",
  "Asking Amazon what has taste...",
  "Politely rejecting the beige options...",
  "Comparing legs, lamps, labels...",
  "Checking if it passes the vibe test...",
  "Sorting signal from showroom noise...",
  "Finding the one with main-character energy...",
  "Making your taste do the shopping...",
];

export default function ProductSearch() {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    searchProducts,
    initialProductSearchState,
  );
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const products = Array.isArray(state?.products) ? state.products : [];
  const statusMessage =
    typeof state?.message === "string"
      ? state.message
      : initialProductSearchState.message;
  const loadingMessage = loadingMessages[loadingMessageIndex];

  useEffect(() => {
    if (state?.status !== "success" || !state.query) {
      return;
    }

    router.push(`/shortlist?q=${encodeURIComponent(state.query)}`);
  }, [router, state?.query, state?.status]);

  useEffect(() => {
    if (!pending) {
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingMessageIndex((current) =>
        (current + 1) % loadingMessages.length,
      );
    }, reduceMotion ? 2400 : 1700);

    return () => window.clearInterval(interval);
  }, [pending, reduceMotion]);

  return (
    <section className="relative mt-16 overflow-hidden border-2 border-motif-black bg-motif-blue p-5 text-motif-ivory shadow-[12px_12px_0_var(--color-motif-red)] sm:mt-24 sm:p-10 lg:mt-28 lg:p-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-[12%] hidden w-px bg-motif-ivory/15 lg:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full border-[3rem] border-motif-ivory/10" />
      <span className="absolute right-3 top-3 rotate-3 border-2 border-motif-black bg-motif-ivory px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-motif-black sm:-right-3 sm:-top-5 sm:px-4 sm:text-xs sm:tracking-[0.18em]">
        Live product signal
      </span>

      <div className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
        <div className="max-w-3xl">
          <p className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-motif-ivory/70">
            <span className="size-2 bg-motif-red" />
            Taste → Object
          </p>
          <h2 className="max-w-2xl text-6xl font-black uppercase leading-[0.76] sm:text-8xl lg:text-[8.5rem]">
            Find things
            <span className="bodoniModa block font-normal italic text-motif-ivory">
              that get you.
            </span>
          </h2>
          <p className="mt-8 max-w-xl border-l-[6px] border-motif-red pl-5 text-base leading-7 text-motif-ivory/80 sm:text-lg sm:leading-8">
            Name the object you want. Motif combines that search with your
            visual DNA and scans live shopping results for the closest fit.
          </p>
        </div>

        <form action={formAction} className="relative lg:pb-1">
          <label
            htmlFor="taste-search"
            className="mb-4 block text-xs font-black uppercase tracking-[0.22em]"
          >
            What are we hunting for?
          </label>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute left-5 top-1/2 size-7 -translate-y-1/2 text-motif-black"
              />
              <input
                id="taste-search"
                name="query"
                type="search"
                minLength={2}
                maxLength={80}
                required
                defaultValue={state?.query ?? ""}
                placeholder="Chair, jacket, lamp..."
                aria-describedby="search-status"
                className="w-full border-2 border-motif-black bg-motif-ivory py-5 pl-16 pr-5 text-lg font-bold text-motif-black outline-none transition-shadow placeholder:text-motif-black/45 focus:shadow-[6px_6px_0_var(--color-motif-red)] sm:text-xl"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="group inline-flex min-h-16 items-center justify-between border-2 border-motif-black bg-motif-red px-6 py-5 text-sm font-black uppercase tracking-[0.16em] text-motif-ivory transition hover:-translate-y-1 hover:bg-motif-ivory hover:text-motif-red hover:shadow-[6px_6px_0_var(--color-motif-black)] disabled:cursor-wait disabled:opacity-60 motion-reduce:transform-none sm:text-base"
            >
              <span className="text-left">{pending ? loadingMessage : "Search my style"}</span>
              <ArrowRight
                aria-hidden="true"
                className="size-6 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </button>
          </div>
          <p
            id="search-status"
            aria-live="polite"
            className={`mt-3 text-xs font-bold uppercase tracking-[0.12em] ${
              state?.status === "error"
                ? "text-motif-ivory"
                : "text-motif-ivory/60"
            }`}
          >
            {pending
              ? "Your object is being filtered through your visual DNA."
              : statusMessage}
          </p>
        </form>
      </div>

      {products.length > 0 && (
        <p className="relative mt-8 border-t-2 border-motif-black pt-5 text-xs font-black uppercase tracking-[0.16em] text-motif-ivory/70">
          Signal found. Opening your visual shortlist...
        </p>
      )}
    </section>
  );
}
