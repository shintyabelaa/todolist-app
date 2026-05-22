"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Caught runtime error:", error);
  }, [error]);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-6 text-center"
      style={{ backgroundColor: "#fdfbf7" }}
    >
      <div className="max-w-md w-full border border-stone-200 bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center">
        <div className="p-4 rounded-full bg-red-50 text-red-600 mb-6">
          <AlertTriangle className="w-10 h-10 stroke-2" />
        </div>

        <h1 className="text-2xl font-black text-stone-900 tracking-tight mb-2">
          Something went wrong!
        </h1>
        <p className="text-sm text-stone-500 font-medium mb-8 leading-relaxed">
          An unexpected error occurred while loading your workspace data. Please
          try refreshing or head back to home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button
            onClick={() => reset()}
            className="bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl text-xs tracking-wide py-5 flex-1"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-2 stroke-[2.5]" /> TRY AGAIN
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="border-stone-200 hover:bg-stone-50 text-stone-700 font-medium rounded-xl text-xs tracking-wide py-5 flex-1"
          >
            <Home className="w-3.5 h-3.5 mr-2" /> BACK TO HOME
          </Button>
        </div>
      </div>
    </main>
  );
}
