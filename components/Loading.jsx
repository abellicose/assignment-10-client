export default function Loading({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <p className="text-sm font-medium text-ink-700/70">{label}</p>
    </div>
  );
}
