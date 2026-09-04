"use server";

import { auth } from "../../auth";
import { getAnonymousOwnerId, getTasteProfile } from "../lib/taste-profile";
import {
  searchTasteShapedProducts,
  type ProductSearchResult,
} from "../lib/product-search";
import {
  commitUsage,
  releaseUsage,
  reserveUsage,
  UsageAllowanceError,
  type UsageReservation,
} from "../lib/usage-allowance";

export type ProductSearchState = {
  status: "idle" | "success" | "error";
  message: string;
  query: string;
  products: ProductSearchResult[];
};

export async function searchProducts(
  _previousState: ProductSearchState,
  formData: FormData,
): Promise<ProductSearchState> {
  const rawQuery = formData.get("query");
  const query = typeof rawQuery === "string" ? rawQuery.trim() : "";

  if (query.length < 2 || query.length > 80) {
    return {
      status: "error",
      message: "Enter between 2 and 80 characters.",
      query,
      products: [],
    };
  }

  const session = await auth();
  const tasteProfile = await getTasteProfile(session?.user?.id);

  if (!tasteProfile) {
    return {
      status: "error",
      message: "Create a taste profile before searching for products.",
      query,
      products: [],
    };
  }

  let usageReservation: UsageReservation | null = null;

  try {
    usageReservation = await reserveUsage("search", {
      userId: session?.user?.id,
      anonymousOwnerId: session?.user?.id ? undefined : await getAnonymousOwnerId(),
    });
    const products = await searchTasteShapedProducts(query, tasteProfile);
    await commitUsage(usageReservation);
    usageReservation = null;

    if (products.length === 0) {
      return {
        status: "error",
        message: "No matches surfaced. Try a broader object name.",
        query,
        products: [],
      };
    }

    return {
      status: "success",
      message: `${products.length} taste-shaped Amazon matches for “${query}”.`,
      query,
      products,
    };
  } catch (error) {
    if (usageReservation) {
      try {
        await releaseUsage(usageReservation);
      } catch (releaseError) {
        console.error("Could not restore search allowance:", releaseError);
      }
    }

    if (error instanceof UsageAllowanceError) {
      return {
        status: "error",
        message: error.message,
        query,
        products: [],
      };
    }

    console.error("Product search failed:", error);

    return {
      status: "error",
      message: "The product signal dropped. Please try again in a moment.",
      query,
      products: [],
    };
  }
}
