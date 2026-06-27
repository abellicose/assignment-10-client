"use client";

import Link from "next/link";
import { FiAlertTriangle } from "react-icons/fi";

export default function Error({ error, reset }) {
  return (
    <div className="grid min-h-screen place-items-center bg-sand-50 p-4">
      <div className="card-surface max-w-md p-10 text-center">
        <FiAlertTriangle className="mx-auto text-6xl text-accent-500" />
        <h1 className="mt-4 section-title text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-ink-700/70">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => reset()} className="btn-primary">Try again</button>
          <Link href="/" className="rounded-lg border border-sand-200 px-4 py-2.5 font-semibold text-brand-700">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
