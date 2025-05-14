import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getProductById } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const product = await getProductById(params.id);
    return (
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto md:max-w-none py-4 md:py-8">
            <div className="flex items-center justify-between mb-4 md:mb-8">
              <div className="flex justify-center items-center bg-white p-2 rounded-lg">
                <Link href="/" className="p-1">
                  <ChevronLeft className="w-8 h-8" />
                </Link>
              </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-5">
              <div className="mb-6 md:mb-0 md:col-span-1 lg:col-span-3">
                {product.screenshot_url && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Image
                      src={product.screenshot_url || "/placeholder.svg"}
                      alt={product.name}
                      width={800}
                      height={600}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-1 lg:col-span-2">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start mb-6">
                    <div className="rounded-lg mr-4">
                      <Image
                        src={product.thumbnail.image_url || "/placeholder.svg"}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{product.name}</h1>
                      <p className="text-gray-500 uppercase text-sm">
                        {product.platforms && product.platforms.length > 0
                          ? product.platforms.join(", ")
                          : "WEB"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-gray-700">{product.tagline}</p>
                    {product.description &&
                      product.description !== product.tagline && (
                        <p className="text-gray-700">{product.description}</p>
                      )}
                    <p className="text-gray-700">
                      Have a question about this product? Ask the Makers
                    </p>
                  </div>

                  {product.ranking && (
                    <div className="flex items-center mb-8 bg-gray-50 p-4 rounded-lg">
                      <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                        <span className="text-gray-700 font-medium">
                          {product.ranking.position}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          #{product.ranking.position} Product of theDay
                        </p>
                        <p className="text-gray-500 text-sm">
                          {product.ranking.date}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <a className="w-full" href={product.website}>
                      <Button
                        variant="default"
                        className="flex-1 cursor-pointer w-full bg-orange-500 hover:bg-orange-400"
                      >
                        Get It
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error in product page:", error);
    notFound();
  }
}
