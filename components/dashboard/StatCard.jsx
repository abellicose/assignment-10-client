export default function StatCard({ icon: Icon, label, value, accent = "brand" }) {
  const tones = {
    brand: "bg-brand-100 text-brand-600",
    accent: "bg-accent-400/20 text-accent-600",
    green: "bg-emerald-100 text-emerald-600",
  };
  return (
    <div className="card-surface flex items-center gap-4 p-5">
      <span className={`grid h-12 w-12 place-items-center rounded-xl text-2xl ${tones[accent]}`}>
        {Icon && <Icon />}
      </span>
      <div>
        <p className="text-2xl font-bold text-ink-900">{value}</p>
        <p className="text-sm text-ink-700/70">{label}</p>
      </div>
    </div>
  );
}
