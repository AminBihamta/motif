"use server";

import { auth } from "../../auth";
import {
  assertHumanRequest,
  BotProtectionError,
} from "../lib/bot-protection";
import { getAnonymousOwnerId, getTasteProfile } from "../lib/taste-profile";
import { getUsageSummary } from "../lib/usage-allowance";
import type { ProductSearchResult } from "../lib/product-search";

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

  try {
    await assertHumanRequest();
  } catch (error) {
    if (error instanceof BotProtectionError) {
      return {
        status: "error",
        message: error.message,
        query,
        products: [],
      };
    }
    throw error;
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

  try {
    const usage = await getUsageSummary({
      userId: session?.user?.id,
      anonymousOwnerId: session?.user?.id
        ? undefined
        : await getAnonymousOwnerId(),
    });

    if (!usage || usage.searchesRemaining < 1) {
      return {
        status: "error",
        message: session?.user?.id
          ? "You have used this week’s searches. Your allowance refreshes in up to seven days."
          : "You have used your free searches. Sign in or verify your account to continue.",
        query,
        products: [],
      };
    }

    return {
      status: "success",
      message: "Opening your visual shortlist...",
      query,
      products: [],
    };
  } catch (error) {
    console.error("Product search precheck failed:", error);

    return {
      status: "error",
      message: "The product signal dropped. Please try again in a moment.",
      query,
      products: [],
    };
  }
}
