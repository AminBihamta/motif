"use client";

import { ArrowRight, Search } from "iconoir-react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import {
  useActionState,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { searchProducts } from "../my-vibe/actions";
import type { ProductSearchState } from "../my-vibe/actions";
import { capturePostHogEvent } from "../lib/posthog";

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

export type ProductPreviewImage = {
  src: string;
  alt: string;
  label: string;
  unoptimized?: boolean;
};

export const curatedProductPreviews: ProductPreviewImage[] = [
  {
    src: "/assets/product-previews/chair.png",
    alt: "Mid-century lounge chair",
    label: "Chair",
  },
  {
    src: "/assets/product-previews/jacket.png",
    alt: "Tailored wool jacket",
    label: "Jacket",
  },
  {
    src: "/assets/product-previews/lamp.png",
    alt: "Brass table lamp",
    label: "Lamp",
  },
  {
    src: "/assets/product-previews/vase.png",
    alt: "Terracotta ceramic vase",
    label: "Vase",
  },
  {
    src: "/assets/product-previews/boots.png",
    alt: "Leather Chelsea boots",
    label: "Boots",
  },
  {
    src: "/assets/product-previews/bag.png",
    alt: "Leather handbag",
    label: "Bag",
  },
  {
    src: "/assets/product-previews/sunglasses.png",
    alt: "Tortoiseshell sunglasses",
    label: "Shades",
  },
  {
    src: "/assets/product-previews/watch.png",
    alt: "Leather strap watch",
    label: "Watch",
  },
  {
    src: "/assets/product-previews/table.png",
    alt: "Walnut side table",
    label: "Table",
  },
];

type UsageDisplay = {
  analysesRemaining: number;
  searchesRemaining: number;
  eligible: boolean;
  isGuest: boolean;
} | null;

function ProductPreviewCarousel({ images }: { images: ProductPreviewImage[] }) {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useEffectEvent((index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.querySelectorAll<HTMLElement>("[data-slide]"));
    const target = slides[index];
    if (!target) return;

    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    });
    setActiveIndex(index);
  });

  const goNext = useEffectEvent(() => {
    if (images.length === 0) return;
    scrollToIndex((activeIndex + 1) % images.length);
  });

  const goPrev = useEffectEvent(() => {
    if (images.length === 0) return;
    scrollToIndex((activeIndex - 1 + images.length) % images.length);
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const syncActive = () => {
      const slides = Array.from(
        track.querySelectorAll<HTMLElement>("[data-slide]"),
      );
      if (slides.length === 0) return;

      const scrollLeft = track.scrollLeft;
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.offsetLeft - track.offsetLeft - scrollLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });

      setActiveIndex(closest);
    };

    track.addEventListener("scroll", syncActive, { passive: true });
    return () => track.removeEventListener("scroll", syncActive);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused || images.length < 2) return;

    const interval = window.setInterval(() => {
      goNext();
    }, 3200);

    return () => window.clearInterval(interval);
  }, [goNext, images.length, paused, reduceMotion]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          goNext();
        }
      }}
    >
      <div
        ref={trackRef}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-motif-red [&::-webkit-scrollbar]:hidden"
        aria-label="Example objects you can search for. Use left and right arrow keys to browse."
        role="region"
      >
        {images.map((image, index) => (
          <article
            key={`${image.src}-${image.label}`}
            data-slide
            className="relative aspect-[4/5] w-[calc((100%-0.75rem)/2)] shrink-0 snap-start overflow-hidden border-2 border-motif-ivory shadow-[5px_5px_0_var(--color-motif-black)] lg:w-[calc((100%-1.5rem)/3)]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              unoptimized={image.unoptimized}
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover saturate-[0.9]"
              priority={index < 3}
            />
          </article>
        ))}
      </div>
    </div>
  );
}

function AllowanceNote({ usage }: { usage: NonNullable<UsageDisplay> }) {
  if (!usage.eligible) {
    return (
      <p className="text-sm font-semibold leading-6 text-motif-ivory">
        Verify your email to unlock searches.{" "}
        <Link
          href="/signin"
          className="font-black text-motif-ivory underline decoration-motif-red decoration-2 underline-offset-4 hover:text-motif-red"
        >
          Verify account
        </Link>
      </p>
    );
  }

  const countLabel = usage.searchesRemaining === 1 ? "search" : "searches";
  const remainingLabel = usage.isGuest
    ? `${usage.searchesRemaining} guest ${countLabel} remaining`
    : `${usage.searchesRemaining} ${countLabel} remaining this week`;

  return (
    <p className="text-sm font-black uppercase tracking-[0.08em] text-motif-ivory">
      {remainingLabel}
    </p>
  );
}

export default function ProductSearch({
  usage,
  previewImages,
}: {
  usage: UsageDisplay;
  previewImages?: ProductPreviewImage[];
}) {
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
  const carouselImages =
    previewImages && previewImages.length > 0
      ? previewImages
      : curatedProductPreviews;

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
    <section className="relative mt-16 overflow-hidden border-2 border-motif-black bg-motif-blue p-6 text-motif-ivory shadow-[16px_16px_0_var(--color-motif-red)] sm:mt-24 sm:p-10 lg:mt-28 lg:px-14 lg:pb-8 lg:pt-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-[12%] hidden w-px bg-motif-ivory/15 lg:block" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full border-[3rem] border-motif-ivory/10" />

      <div className="relative space-y-10 lg:space-y-12">
        <div className="w-full">
          <h2 className="w-full max-w-none text-5xl font-black uppercase leading-[0.82] sm:text-7xl lg:text-[7.25rem]">
            Find things
            <span className="bodoniModa block font-normal italic text-motif-ivory">
              that get you.
            </span>
          </h2>
          <p className="mt-5 max-w-[calc(42rem-100px)] border-l-2 border-motif-red pl-5 text-base leading-7 text-motif-ivory/90 sm:mt-6 sm:text-lg sm:leading-8">
            Name the object you want. Motif combines that search with your
            visual DNA and scans live shopping results for the closest fit.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
          <ProductPreviewCarousel images={carouselImages} />

          <form
            action={formAction}
            onSubmit={() =>
              capturePostHogEvent("product_search_started", {
                account_type: usage?.isGuest ? "guest" : "member",
              })
            }
            className="border-2 border-motif-black bg-motif-black/25 p-5 shadow-[8px_8px_0_var(--color-motif-black)] sm:p-6 lg:-mt-[80px] lg:-mb-[80px]"
          >
            <label
              htmlFor="taste-search"
              className="mb-3 block text-base font-black uppercase tracking-[0.08em] text-motif-ivory"
            >
              What are you looking for?
            </label>
            <div className="flex flex-col gap-3">
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
                  placeholder="Chair, jacket, lamp…"
                  aria-describedby={
                    usage ? "search-status search-allowance" : "search-status"
                  }
                  className="w-full border-2 border-motif-black bg-motif-ivory py-5 pl-16 pr-5 text-lg font-bold text-motif-black outline-none transition-shadow placeholder:text-motif-black/50 focus:shadow-[6px_6px_0_var(--color-motif-red)] sm:text-xl"
                />
              </div>

              {usage && (
                <div id="search-allowance" className="pt-0.5">
                  <AllowanceNote usage={usage} />
                </div>
              )}

              <button
                type="submit"
                disabled={pending}
                className="group inline-flex min-h-16 items-center justify-between border-2 border-motif-black bg-motif-red px-6 py-5 text-base font-black uppercase tracking-[0.1em] text-motif-ivory transition hover:-translate-y-1 hover:bg-motif-ivory hover:text-motif-red hover:shadow-[6px_6px_0_var(--color-motif-black)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-motif-ivory disabled:cursor-wait disabled:opacity-60 motion-reduce:transform-none"
              >
                <span className="text-left">
                  {pending ? loadingMessage : "Find matches"}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-6 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                />
              </button>
            </div>
            <p
              id="search-status"
              aria-live="polite"
              className={`mt-4 text-sm font-semibold leading-6 ${
                state?.status === "error"
                  ? "text-motif-ivory"
                  : "text-motif-ivory/80"
              }`}
            >
              {pending
                ? "Your object is being filtered through your visual DNA."
                : statusMessage}
            </p>
          </form>
        </div>
      </div>

      {products.length > 0 && (
        <p className="relative mt-8 border-t-2 border-motif-black pt-5 text-sm font-bold uppercase tracking-[0.1em] text-motif-ivory/85">
          Signal found. Opening your visual shortlist...
        </p>
      )}
    </section>
  );
}
