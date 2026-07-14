import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

const rows = [
  { name: "product_classifier", metric: "top-1 accuracy", target: "≥ 0.80" },
  { name: "detector", metric: "mAP@0.5", target: "≥ 0.50" },
  { name: "risk_model", metric: "RMSE", target: "≤ 0.15" },
];

export default function Metrics() {
  const [health, setHealth] = useState(null);
  useEffect(() => {
    api.health().then(setHealth).catch(() => setHealth({ status: "down" }));
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-panel p-4">
        <h2 className="mb-2 text-sm uppercase tracking-widest text-muted">
          model_registry // /api/health
        </h2>
        <pre className="overflow-auto rounded bg-canvas p-3 text-xs">
          {JSON.stringify(health, null, 2)}
        </pre>
      </section>
      <section className="rounded-2xl border border-border bg-panel p-4">
        <h2 className="mb-3 text-sm uppercase tracking-widest text-muted">
          model_targets
        </h2>
        <table className="w-full text-sm">
          <thead className="text-muted">
            <tr>
              <th className="text-left">model</th>
              <th className="text-left">metric</th>
              <th className="text-left">target</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-border">
                <td className="py-1 font-mono">{r.name}</td>
                <td>{r.metric}</td>
                <td className="text-accent">{r.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
