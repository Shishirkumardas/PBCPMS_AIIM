"use client";

export default function StatCard({
  title,
  value,
  hint,
  accent = "green",
}: {
  title: string;
  value: number | string;
  hint?: string;
  accent?: "green" | "gold" | "red" | "sky";
}) {
  const accents = {
    green: "border-l-bd-green bg-gradient-to-br from-white to-bd-green-light/40",
    gold: "border-l-bd-gold bg-gradient-to-br from-white to-amber-50/60",
    red: "border-l-bd-red bg-gradient-to-br from-white to-red-50/50",
    sky: "border-l-sky-500 bg-gradient-to-br from-white to-sky-50/50",
  };

  return (
    <div className={`card border-l-4 ${accents[accent]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold text-bd-green-dark">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
