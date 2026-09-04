import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "../../auth";
import ShortlistResults from "../components/shortlist-results";
import {
  searchTasteShapedProducts,
  type ProductSearchResult,
} from "../lib/product-search";
import { getTasteProfile } from "../lib/taste-profile";

export const metadata: Metadata = {
  title: "Motif — The Shortlist",
  description: "A taste-shaped edit of things worth bringing home.",
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
  const userName = session?.user?.name ?? null;

  if (!query) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-motif-black px-6 text-motif-ivory">
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
      </main>
    );
  }

  if (query.length < 2 || query.length > 80 || !tasteProfile) {
    return (
      <ShortlistResults
        query={query}
        products={[]}
        tasteProfile={tasteProfile}
        userName={userName}
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

  try {
    products = await searchTasteShapedProducts(query, tasteProfile);
    errorMessage = products.length === 0
      ? "No matches surfaced. Try a broader object name."
      : undefined;
  } catch (error) {
    console.error("Shortlist page failed:", error);
    errorMessage = "The product signal dropped. Please try again in a moment.";
  }

  return (
    <ShortlistResults
      query={query}
      products={products}
      tasteProfile={tasteProfile}
      userName={userName}
      errorMessage={errorMessage}
    />
  );
}
