import { useEffect, useRef } from "react";

// Placeholder wrapper — the actual globe (react-globe.gl) is heavy and lazy
// loaded so the app boots fast. This component establishes the layout slot.
export default function SupplyChainGlobe({ arcs = [] }) {
  const mount = useRef(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { default: Globe } = await import("react-globe.gl").catch(() => ({
        default: null,
      }));
      if (!Globe || cancelled || !mount.current) return;
      // Real Globe lands in the "globe: mount react-globe.gl" commit.
    })();
    return () => {
      cancelled = true;
    };
  }, [arcs]);

  return (
    <div
      ref={mount}
      className="flex h-72 items-center justify-center rounded-2xl border border-border bg-panel"
    >
      <p className="text-sm text-muted">
        globe // {arcs.length} supply-chain arcs (mounting in a later commit)
      </p>
    </div>
  );
}
