"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";

function Success() {
  const params = useSearchParams();
  const tx = params.get("tx");

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="card-surface max-w-md p-10 text-center">
        <FiCheckCircle className="mx-auto text-6xl text-emerald-500" />
        <h1 className="mt-4 section-title text-2xl">Payment Successful</h1>
        <p className="mt-2 text-ink-700/70">
          Your booking has been confirmed. The owner will review your request shortly.
        </p>
        {tx && (
          <p className="mt-3 break-all rounded-lg bg-sand-100 p-2 font-mono text-xs text-brand-700">
            {tx}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard/bookings" className="btn-primary">View My Bookings</Link>
          <Link href="/properties" className="rounded-lg border border-sand-200 px-4 py-2.5 font-semibold text-brand-700">
            Browse More
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <Success />
    </Suspense>
  );
}
