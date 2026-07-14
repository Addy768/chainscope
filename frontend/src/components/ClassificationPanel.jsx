export default function ClassificationPanel({ predictions }) {
  if (!predictions?.length) return null;
  return (
    <div className="rounded-2xl border border-border bg-panel p-4">
      <h3 className="mb-3 text-sm uppercase tracking-widest text-muted">
        product_classifier // top-5
      </h3>
      <ul className="space-y-2">
        {predictions.map((p, i) => (
          <li key={p.label} className="flex items-center gap-3">
            <span className="w-32 truncate text-sm">{p.label}</span>
            <div className="h-2 flex-1 rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${(p.confidence * 100).toFixed(1)}%` }}
              />
            </div>
            <span className="w-14 text-right font-mono text-sm text-muted">
              {(p.confidence * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
