function MetricCard({ title, value, subtitle }) {
  return (
    <article className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
      <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
    </article>
  );
}

export default MetricCard;
