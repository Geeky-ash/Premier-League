'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error boundary triggered:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-cohere-canvas">
      <div className="max-w-md w-full product-card p-8 text-center bg-cohere-canvas border border-cohere-hairline rounded-lg">
        <span className="inline-block px-3 py-1 text-[11px] font-mono tracking-mono uppercase text-cohere-coral bg-cohere-soft-stone rounded-pill mb-4">
          System Recovery
        </span>
        <h1 className="font-display text-3xl font-bold text-cohere-primary tracking-tight mb-2">
          Telemetry Interrupted
        </h1>
        <p className="text-sm font-body text-cohere-body-muted mb-6 leading-relaxed">
          An unexpected interface anomaly occurred while processing the live matchday feed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="button-primary px-6 py-2.5 text-xs font-mono font-medium tracking-mono uppercase text-white bg-cohere-primary rounded-pill hover:bg-cohere-black transition-colors"
          >
            Retry Connection
          </button>
          <Link
            href="/fixtures"
            className="button-secondary px-6 py-2.5 text-xs font-mono font-medium tracking-mono uppercase text-cohere-primary bg-cohere-soft-stone rounded-pill hover:bg-cohere-hairline transition-colors"
          >
            Return to Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
