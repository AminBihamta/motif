import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "../../auth";
import ShortlistResults from "../components/shortlist-results";
import SiteHeader from "../components/site-header";
import {
  searchTasteShapedProducts,
  type ProductSearchResult,
} from "../lib/product-search";
import { getAnonymousOwnerId, getTasteProfile } from "../lib/taste-profile";
import {
  commitUsage,
  releaseUsage,
  reserveUsage,
  UsageAllowanceError,
  type UsageReservation,
} from "../lib/usage-allowance";

export const metadata: Metadata = {
  title: "The Shortlist",
  description: "A taste-shaped edit of things worth bringing home.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ShortlistPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim() ?? "";
  const session = await auth();
  const tasteProfile = await getTasteProfile(session?.user?.id);

  if (!query) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-motif-black text-motif-ivory">
        <SiteHeader priority />
        <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-6">
          <div className="max-w-xl border-2 border-motif-ivory p-8 text-center sm:p-12">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-motif-red">
              No object on file
            </p>
            <h1 className="mt-5 text-6xl font-black uppercase leading-[0.8] sm:text-8xl">
              Give us
              <span className="bodoniModa block font-normal italic text-motif-taupe">
                something to find.
              </span>
            </h1>
            <Link
              href="/my-vibe"
              className="mt-10 inline-flex border-2 border-motif-black bg-motif-red px-5 py-4 text-xs font-black uppercase tracking-[0.16em] text-motif-ivory shadow-[6px_6px_0_var(--color-motif-ivory)] transition-transform hover:-translate-y-1"
            >
              Back to your vibe ↗
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (query.length < 2 || query.length > 80 || !tasteProfile) {
    return (
      <ShortlistResults
        query={query}
        products={[]}
        tasteProfile={tasteProfile}
        errorMessage={
          tasteProfile
            ? "That object needs between 2 and 80 characters."
            : "Create a taste profile before searching for products."
        }
      />
    );
  }

  let products: ProductSearchResult[] = [];
  let errorMessage: string | undefined;
  let usageReservation: UsageReservation | null = null;

  try {
    usageReservation = await reserveUsage("search", {
      userId: session?.user?.id,
      anonymousOwnerId: session?.user?.id
        ? undefined
        : await getAnonymousOwnerId(),
    });
    products = await searchTasteShapedProducts(query, tasteProfile);
    await commitUsage(usageReservation);
    usageReservation = null;
    errorMessage =
      products.length === 0
        ? "No matches surfaced. Try a broader object name."
        : undefined;
  } catch (error) {
    if (usageReservation) {
      try {
        await releaseUsage(usageReservation);
      } catch (releaseError) {
        console.error("Could not restore shortlist search allowance:", releaseError);
      }
    }

    if (error instanceof UsageAllowanceError) {
      errorMessage = error.message;
    } else {
      console.error("Shortlist page failed:", error);
      errorMessage = "The product signal dropped. Please try again in a moment.";
    }
  }

  return (
    <ShortlistResults
      query={query}
      products={products}
      tasteProfile={tasteProfile}
      errorMessage={errorMessage}
    />
  );
}
