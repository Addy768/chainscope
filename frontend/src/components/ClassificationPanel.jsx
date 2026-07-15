import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function ClassificationPanel({ predictions }) {
  if (!predictions?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-glow p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
          <Sparkles size={14} className="text-accent" />
          product_classifier // top-5
        </h3>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase text-muted">
          resnet50
        </span>
      </div>
      <ul className="space-y-3">
        {predictions.map((p, i) => (
          <motion.li
            key={p.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3"
          >
            <span className="w-28 truncate text-sm">{p.label}</span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(p.confidence * 100).toFixed(1)}%` }}
                transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.06 }}
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #7c5cff 0%, #22d3ee 100%)",
                }}
              />
            </div>
            <span className="w-14 text-right font-mono text-sm text-muted">
              {(p.confidence * 100).toFixed(1)}%
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
