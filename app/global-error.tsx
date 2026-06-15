"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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
    <html>
      <body className="min-h-screen bg-surface flex flex-col items-center justify-center text-center px-4 font-sans">
        <p className="text-4xl">😵</p>
        <h1 className="mt-4 text-2xl font-bold text-ink">Something went wrong</h1>
        <p className="mt-2 text-ink-muted max-w-sm">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-ink-faint font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <Button className="mt-8" onClick={reset}>
          Try again
        </Button>
      </body>
    </html>
  );
}
