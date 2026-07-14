export default function RiskDashboard({ score, contributors }) {
  const pct = Math.round((score ?? 0) * 100);
  const color = pct < 34 ? "bg-good" : pct < 67 ? "bg-warn" : "bg-bad";
  return (
    <div className="rounded-2xl border border-border bg-panel p-4">
      <h3 className="mb-3 text-sm uppercase tracking-widest text-muted">
        risk_model // score + top SHAP contributors
      </h3>
      <div className="mb-4">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-4xl font-bold">{pct}</span>
          <span className="text-sm text-muted">/ 100</span>
        </div>
        <div className="h-2 rounded-full bg-border">
          <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="space-y-2 text-sm">
        {(contributors || []).map((c) => (
          <li key={c.feature} className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                c.direction === "up" ? "bg-bad" : "bg-good"
              }`}
            />
            <span className="flex-1 font-mono text-muted">{c.feature}</span>
            <span className="font-mono">
              {c.shap > 0 ? "+" : ""}
              {c.shap}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
