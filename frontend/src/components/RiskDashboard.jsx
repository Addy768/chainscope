import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Cpu } from "lucide-react";
import RiskGauge from "./RiskGauge.jsx";

const prettyName = (s) =>
  s.replace(/_/g, " ").replace(/\bscaled\b/g, "").trim();

export default function RiskDashboard({ score, tier, contributors, backend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-glow p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
          <Cpu size={14} className="text-accent" />
          risk_model // score + top contributors
        </h3>
        {backend && (
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase text-muted">
            {backend.replace(/_/g, " ")}
          </span>
        )}
      </div>

      <div className="mb-6 flex items-center justify-around">
        <RiskGauge score={score} tier={tier} />
        <ul className="space-y-2 text-sm">
          {(contributors || []).map((c, i) => (
            <motion.li
              key={c.feature}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-2"
            >
              {c.direction === "up" ? (
                <ArrowUpRight size={14} className="text-bad" />
              ) : (
                <ArrowDownRight size={14} className="text-good" />
              )}
              <span className="min-w-[140px] font-mono text-muted">
                {prettyName(c.feature)}
              </span>
              <span className="font-mono">
                {c.shap > 0 ? "+" : ""}
                {c.shap}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
