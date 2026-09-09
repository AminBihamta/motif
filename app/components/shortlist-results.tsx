"use client";

import { ArrowRight, OpenNewWindow, Star } from "iconoir-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ProductSearchResult } from "../lib/product-search";
import { capturePostHogEvent } from "../lib/posthog";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

type ShortlistProfile = {
  vibeName: string;
  characteristics: string[];
  colors: string[];
};

type ShortlistResultsProps = {
  query: string;
  products: ProductSearchResult[];
  tasteProfile: ShortlistProfile | null;
  errorMessage?: string;
  isSignedIn?: boolean;
};

function ProductCard({
  product,
  index,
}: {
  product: ProductSearchResult;
  index: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        capturePostHogEvent("product_result_opened", {
          result_position: index + 1,
          source: product.source,
        })
      }
      initial={{ opacity: 0, y: reduceMotion ? 0 : 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -8 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : Math.min(index * 0.07, 0.5), ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex min-w-0 w-full max-w-full flex-col border-2 border-motif-black bg-motif-ivory p-3 text-motif-black shadow-[4px_4px_0_var(--color-motif-red)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-ivory sm:shadow-[6px_6px_0_var(--color-motif-red)]"
    >
      <span className="absolute left-0 top-0 z-10 bg-motif-black px-2 py-1 text-[9px] font-black tracking-[0.16em] text-motif-ivory">
        MATCH-{String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative aspect-[4/3] overflow-hidden border-2 border-motif-black bg-motif-taupe/20">
        {product.thumbnail ? (
          // SearchApi returns remote Amazon thumbnails.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt=""
            loading={index < 3 ? "eager" : "lazy"}
            className="size-full object-contain p-4 transition duration-700 ease-out group-hover:scale-110 motion-reduce:transform-none"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs font-black uppercase tracking-[0.18em]">
            Image unavailable
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-motif-red">
          {product.source}
        </p>
        <h2 className="mt-2 line-clamp-3 text-lg font-black leading-[0.95]">
          {product.title}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2 text-[9px] font-black uppercase tracking-[0.14em]">
          {product.isPrime && <span className="border border-motif-blue px-2 py-1 text-motif-blue">Prime</span>}
          {product.availability && <span className="border border-motif-black px-2 py-1 text-motif-black/70">{product.availability}</span>}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-8">
          <div>
            <p className="text-xl font-black">{product.price ?? "See price"}</p>
            {product.rating !== null && (
              <p className="mt-1 flex items-center gap-1 text-[10px] font-bold">
                <Star aria-hidden="true" className="size-3 fill-current" />
                {product.rating}{product.reviews !== null && ` · ${product.reviews} reviews`}
              </p>
            )}
          </div>
          <OpenNewWindow aria-hidden="true" className="size-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none" />
        </div>
      </div>
    </motion.a>
  );
}

export default function ShortlistResults({
  query,
  products,
  tasteProfile,
  errorMessage,
  isSignedIn = false,
}: ShortlistResultsProps) {
  const reduceMotion = useReducedMotion();
  const signInHref = `/signin?callbackUrl=${encodeURIComponent(`/shortlist?q=${query}`)}`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-motif-black text-motif-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(232,221,200,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(232,221,200,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <SiteHeader priority isSignedIn={isSignedIn} />

      <div className="relative z-10 mx-auto w-full max-w-[96rem] overflow-x-clip px-5 pb-24 pt-16 sm:px-10 sm:pt-24 lg:px-16 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.7 }}
          className="grid min-w-0 gap-10 border-b-2 border-motif-ivory pb-12 lg:grid-cols-[1fr_22rem] lg:items-end"
        >
          <div className="min-w-0">
            <h1 className="max-w-full break-words text-[clamp(2.75rem,16vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.075em]">
              The
              <span className="bodoniModa block font-normal italic text-motif-taupe">
                shortlist.
              </span>
            </h1>
          </div>
          <aside className="min-w-0 w-full max-w-full border-2 border-motif-ivory bg-motif-blue p-4 shadow-[6px_6px_0_var(--color-motif-red)] sm:p-5 sm:shadow-[8px_8px_0_var(--color-motif-red)] lg:rotate-2">
            <p className="break-words text-2xl font-black uppercase leading-[0.95] sm:text-3xl sm:leading-[0.9]">
              {tasteProfile?.vibeName ?? "Unknown signal"}
            </p>
            {tasteProfile ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {tasteProfile.characteristics.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="max-w-full break-words border border-motif-ivory/60 px-2 py-1 text-[9px] font-black uppercase leading-snug tracking-[0.08em]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </aside>
        </motion.div>

        {errorMessage ? (
          <div className="mt-16 border-2 border-motif-red bg-motif-red/15 p-8 sm:p-12">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-motif-red">Signal interrupted</p>
            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.85] sm:text-6xl">The market is being coy.</h2>
            <p className="mt-5 max-w-xl text-lg leading-7 text-motif-ivory/75">{errorMessage}</p>
            <Link href="/my-vibe" className="mt-8 inline-flex items-center gap-3 border-2 border-motif-black bg-motif-red px-5 py-4 text-xs font-black uppercase tracking-[0.16em] shadow-[6px_6px_0_var(--color-motif-ivory)] transition-transform hover:-translate-y-1">Try another object <ArrowRight aria-hidden="true" className="size-5" /></Link>
          </div>
        ) : (
          <section className="mt-16" aria-labelledby="matches-heading">
            <div className="mb-8 flex min-w-0 flex-wrap items-end justify-between gap-5">
              <h2
                id="matches-heading"
                className="max-w-full break-words text-[clamp(2.5rem,14vw,8rem)] font-black uppercase leading-[0.8]"
              >
                {products.length} matches.
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-motif-taupe">
                Product catalogue from Amazon
              </p>
            </div>
            <div className="grid min-w-0 auto-rows-auto gap-6 pb-2 sm:grid-cols-2 lg:auto-rows-[minmax(17rem,auto)] lg:grid-cols-4">
              {products.map((product, index) => (
                <div key={product.id} className="min-w-0 pr-1 pb-1 sm:pr-1.5 sm:pb-1.5">
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-16 border-2 border-motif-black bg-motif-ivory p-2 text-motif-black shadow-[10px_10px_0_var(--color-motif-red)] sm:mt-24 sm:p-4"
            >
              <div className="grid gap-8 border-2 border-motif-black bg-motif-blue p-6 text-motif-ivory sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <h2 className="max-w-3xl text-5xl font-black uppercase leading-[0.8] tracking-[-0.06em] sm:text-7xl">
                    Your taste deserves
                    <span className="bodoniModa block font-normal italic text-motif-ivory">
                      a longer shelf life.
                    </span>
                  </h2>
                  <p className="mt-6 max-w-xl border-l-4 border-motif-red pl-4 text-base leading-7 text-motif-ivory/75 sm:text-lg">
                    Create an account to save this visual DNA and keep your edits close.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href={signInHref}
                    className="group inline-flex min-w-56 items-center justify-between gap-5 border-2 border-motif-black bg-motif-red px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-motif-ivory transition-transform hover:-translate-y-1 hover:bg-motif-ivory hover:text-motif-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-ivory"
                  >
                    Create your account
                    <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </Link>
                  <Link
                    href={signInHref}
                    className="group inline-flex min-w-56 items-center justify-between gap-5 border-2 border-motif-ivory bg-transparent px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-motif-ivory transition-colors hover:bg-motif-ivory hover:text-motif-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-motif-ivory"
                  >
                    Find more vibes
                    <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
