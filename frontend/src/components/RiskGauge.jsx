import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

export default function RiskGauge({ score = 0, tier = "low" }) {
  const CIRC = 2 * Math.PI * 54;
  const [display, setDisplay] = useState(0);
  const mv = useMotionValue(0);
  const dash = useTransform(mv, (v) => CIRC * (1 - v));

  useEffect(() => {
    const controls = animate(mv, score, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v * 100)),
    });
    return controls.stop;
  }, [score, mv]);

  const color = tier === "low" ? "#2ee6a6" : tier === "medium" ? "#ffb454" : "#ff6b6b";

  return (
    <div className="relative flex flex-col items-center">
      <svg width={140} height={140} viewBox="0 0 140 140">
        <defs>
          <linearGradient id="riskGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"  stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <circle cx={70} cy={70} r={54} stroke="#1e2a3c" strokeWidth={10} fill="none" />
        <motion.circle
          cx={70} cy={70} r={54}
          stroke="url(#riskGrad)" strokeWidth={10} fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          style={{ strokeDashoffset: dash, transform: "rotate(-90deg)", transformOrigin: "70px 70px" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums" style={{ color }}>
          {display}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted">
          {tier} risk
        </span>
      </div>
    </div>
  );
}
