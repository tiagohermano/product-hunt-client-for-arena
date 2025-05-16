"use client";

import { useEffect, useState, useRef } from "react";
import { fetchMoreProducts } from "@/app/actions";
import ProductCard from "./product-card";
import { Loader2 } from "lucide-react";
import type { Product } from "@/lib/types";

interface InfiniteProductListProps {
  initialProducts: Product[];
  initialNextCursor: string | null;
  type: "popular" | "newest";
}

export default function InfiniteProductList({
  initialProducts,
  initialNextCursor,
  type,
}: InfiniteProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset state when tab changes
    setProducts(initialProducts);
    setNextCursor(initialNextCursor);
    setIsLoading(false);
  }, [initialProducts, initialNextCursor, type]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && nextCursor && !isLoading) {
          setIsLoading(true);

          try {
            const result = await fetchMoreProducts(type, nextCursor);

            setProducts((prevProducts) => [
              ...prevProducts,
              ...result.products,
            ]);
            setNextCursor(result.nextCursor);
          } catch (error) {
            console.error("Error loading more products:", error);
          } finally {
            setIsLoading(false);
          }
        }
      },
      { threshold: 1.0 },
    );

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [nextCursor, isLoading, type]);

  if (products.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">
          No products found. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        data-testid="list"
        className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div
        ref={observerTarget}
        data-testid="infinite-scroll-sentinel"
        className="w-full flex justify-center py-8"
      >
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500 mr-2" />
            <span className="text-gray-600">Loading more products...</span>
          </div>
        )}

        {!nextCursor && !isLoading && products.length > 0 && (
          <p className="text-gray-500 text-sm">No more products to load</p>
        )}
      </div>
    </>
  );
}
