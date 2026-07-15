import { lazy, Suspense, useMemo } from "react";

const Globe = lazy(() =>
  import("react-globe.gl").catch(() => ({ default: () => null }))
);

const SAMPLE_ARCS = [
  { startLat: 35.0, startLng: 103, endLat: 33.7, endLng: -118.2, color: "#7c5cff", label: "China → Long Beach" },
  { startLat: 22.3, startLng: 114, endLat: 51.5, endLng:   -0.1, color: "#2ee6a6", label: "Hong Kong → London" },
  { startLat: 24.7, startLng: 46.6, endLat:  1.3, endLng:  103.8, color: "#ffb454", label: "Riyadh → Singapore" },
  { startLat: 55.7, startLng: 37.6, endLat: 40.7, endLng:  -74.0, color: "#ff6b6b", label: "Moscow → New York" },
];

export default function SupplyChainGlobe({ arcs }) {
  const data = useMemo(() => arcs?.length ? arcs : SAMPLE_ARCS, [arcs]);
  return (
    <div className="h-72 overflow-hidden rounded-2xl border border-border bg-panel">
      <Suspense fallback={<div className="p-4 text-sm text-muted">loading globe…</div>}>
        <Globe
          height={288}
          width={undefined}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          backgroundColor="rgba(0,0,0,0)"
          arcsData={data}
          arcColor="color"
          arcLabel="label"
          arcAltitude={0.25}
          arcStroke={0.6}
          arcDashLength={0.4}
          arcDashGap={0.15}
          arcDashAnimateTime={2500}
        />
      </Suspense>
    </div>
  );
}
