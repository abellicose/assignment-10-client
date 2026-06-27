export default function PageTitle({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h1 className="section-title text-2xl md:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink-700/70">{subtitle}</p>}
    </div>
  );
}
