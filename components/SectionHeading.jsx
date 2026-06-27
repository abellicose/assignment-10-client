export default function SectionHeading({ eyebrow, title, subtitle, center }) {
  return (
    <div className={`mb-10 ${center ? "mx-auto max-w-2xl text-center" : ""}`}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
          {eyebrow}
        </span>
      )}
      <h2 className="section-title mt-3 text-3xl md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-ink-700/80">{subtitle}</p>}
    </div>
  );
}
