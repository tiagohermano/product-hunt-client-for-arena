import { getProducts } from "@/lib/api";
import InfiniteProductList from "./infinite-product-list";

export default async function ProductList({
  type,
}: {
  type: "popular" | "newest";
}) {
  const { products, nextCursor } = await getProducts(type);

  return (
    <InfiniteProductList
      initialProducts={products}
      initialNextCursor={nextCursor}
      type={type}
    />
  );
}
