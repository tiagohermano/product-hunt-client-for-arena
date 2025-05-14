"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          We couldn't load the products. This might be due to API rate limits or
          authentication issues.
        </p>
        <Button onClick={reset} className="bg-orange-600 hover:bg-orange-700">
          Try again
        </Button>
      </div>
    </div>
  );
}
