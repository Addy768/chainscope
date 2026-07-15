import { motion } from "framer-motion";
import { AlertTriangle, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

const DEFAULTS = {
  source_country: "China",
  source_concentration: 0.55,
  historic_disruption_count: 2,
  trade_value_log: 12,
};

export default function RiskForm({ onResult, busy, setBusy }) {
  const [schema, setSchema] = useState(null);
  const [form, setForm] = useState(DEFAULTS);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.riskSchema()
      .then(setSchema)
      .catch(() => setSchema({ fields: [], backend: "offline" }));
  }, []);

  async function submit(e) {
    e?.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await api.risk(form);
      onResult(r);
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const countries = schema?.fields?.find((f) => f.name === "source_country")?.options || [];

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-glow p-5"
    >
      <h3 className="mb-4 text-xs uppercase tracking-widest text-muted">
        supply_chain_risk // configure a scenario
      </h3>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-muted">source country</span>
          <select
            value={form.source_country}
            onChange={(e) => set("source_country", e.target.value)}
            className="rounded-lg border border-border bg-canvas px-3 py-2 focus:border-accent focus:outline-none"
          >
            {(countries.length ? countries : [DEFAULTS.source_country]).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-muted">source concentration (HHI)</span>
          <input
            type="range" min="0" max="1" step="0.05"
            value={form.source_concentration}
            onChange={(e) => set("source_concentration", parseFloat(e.target.value))}
            className="accent-accent"
          />
          <span className="text-right font-mono text-xs">{form.source_concentration.toFixed(2)}</span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-muted">historic disruptions (last 5y)</span>
          <input
            type="number" min="0" max="20"
            value={form.historic_disruption_count}
            onChange={(e) => set("historic_disruption_count", parseInt(e.target.value || "0", 10))}
            className="rounded-lg border border-border bg-canvas px-3 py-2 focus:border-accent focus:outline-none"
          />
        </label>

        <label className="col-span-2 flex flex-col gap-1">
          <span className="text-muted">trade value log(USD)</span>
          <input
            type="range" min="6" max="18" step="0.5"
            value={form.trade_value_log}
            onChange={(e) => set("trade_value_log", parseFloat(e.target.value))}
            className="accent-accent"
          />
          <span className="text-right font-mono text-xs">{form.trade_value_log.toFixed(1)}</span>
        </label>
      </div>

      {err && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-bad">
          <AlertTriangle size={14} /> {err}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-canvas transition-all hover:shadow-glow disabled:opacity-50"
      >
        <Play size={16} />
        {busy ? "scoring…" : "compute risk score"}
      </button>
    </motion.form>
  );
}
