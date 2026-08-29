"use server";

import { getTasteProfile } from "../lib/taste-profile";
import {
  searchTasteShapedProducts,
  type ProductSearchResult,
} from "../lib/product-search";

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

  const tasteProfile = await getTasteProfile();

  if (!tasteProfile) {
    return {
      status: "error",
      message: "Create a taste profile before searching for products.",
      query,
      products: [],
    };
  }

  try {
    const products = await searchTasteShapedProducts(query, tasteProfile);

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
    console.error("Product search failed:", error);

    return {
      status: "error",
      message: "The product signal dropped. Please try again in a moment.",
      query,
      products: [],
    };
  }
}
