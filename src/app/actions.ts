"use server";

import { getProducts } from "@/lib/api";
import type { Product } from "@/lib/types";

export async function fetchMoreProducts(
  type: "popular" | "newest",
  cursor: string,
): Promise<{ products: Product[]; nextCursor: string | null }> {
  return getProducts(type, cursor);
}
