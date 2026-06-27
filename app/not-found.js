import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-sand-50 p-4">
      <div className="text-center">
        <p className="font-display text-8xl font-bold text-brand-600">404</p>
        <h1 className="mt-2 section-title text-2xl">Page not found</h1>
        <p className="mt-2 text-ink-700/70">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
