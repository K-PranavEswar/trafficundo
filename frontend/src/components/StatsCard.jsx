function StatsCard({ label, value, detail, tone = "cyan" }) {
  const tones = {
    cyan: "from-cyan-400 to-blue-500 text-cyan-950",
    green: "from-emerald-400 to-teal-500 text-emerald-950",
    amber: "from-amber-300 to-orange-500 text-amber-950",
    rose: "from-rose-400 to-red-500 text-rose-950",
    violet: "from-violet-400 to-fuchsia-500 text-violet-950",
  };

  return (
    <article className="metric-card relative overflow-hidden">
      <div className={`absolute right-4 top-4 h-16 w-16 rounded-full bg-gradient-to-br ${tones[tone]} opacity-20 blur-xl`} />
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white">{value}</div>
      {detail && <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">{detail}</p>}
    </article>
  );
}

export default StatsCard;
