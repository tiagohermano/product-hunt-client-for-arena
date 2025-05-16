import { Suspense } from "react";
import ProductList from "@/components/product-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto md:max-w-none">
          <div className="py-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Product Hunt client for Arena.im
            </h1>
          </div>
          <Tabs defaultValue="popular">
            <div className="w-full flex justify-center">
              <TabsList className="w-full grid grid-cols-2 items-center mb-4 md:w-64 md:mx-0">
                <TabsTrigger
                  value="popular"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 data-[state=active]:font-medium"
                >
                  Popular
                </TabsTrigger>
                <TabsTrigger
                  value="newest"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 data-[state=active]:font-medium"
                >
                  Newest
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="popular">
              <Suspense fallback={<ProductListSkeleton />}>
                <ProductList type="popular" />
              </Suspense>
            </TabsContent>
            <TabsContent value="newest">
              <Suspense fallback={<ProductListSkeleton />}>
                <ProductList type="newest" />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

function ProductListSkeleton() {
  return (
    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg p-4 shadow-sm flex items-center"
        >
          <Skeleton className="h-14 w-14 rounded-lg mr-4" />
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="ml-4 flex-shrink-0 flex flex-col items-center">
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
