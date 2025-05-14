import Link from "next/link";
import Image from "next/image";
import { ChevronUp } from "lucide-react";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <div className="bg-white rounded-lg p-4 shadow-sm flex items-center h-full">
        <div className="mr-4 flex-shrink-0">
          <div
            className={`w-14 h-14 rounded-lg flex items-center justify-center relative bg-transparent`}
          >
            <Image
              src={product.thumbnail.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="w-10 h-10 rounded-lg"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base">{product.name}</h3>
          <p className="text-gray-500 text-sm truncate">{product.tagline}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex flex-col items-center">
          <div
            className={`flex-col w-12 h-12 py-2 rounded-lg flex items-center justify-center bg-gray-100`}
          >
            <ChevronUp className="w-5 h-5 text-black" />
            <span className="text-xs mt-1 font-medium">
              {product.votes_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
