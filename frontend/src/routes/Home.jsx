import { useState } from "react";
import ClassificationPanel from "../components/ClassificationPanel.jsx";
import ComponentOverlay from "../components/ComponentOverlay.jsx";
import RiskDashboard from "../components/RiskDashboard.jsx";
import Skeleton from "../components/Skeleton.jsx";
import SupplyChainGlobe from "../components/SupplyChainGlobe.jsx";
import Uploader from "../components/Uploader.jsx";
import { api } from "../lib/api.js";
import { useDemo } from "../lib/demoMode.js";

export default function Home() {
  const { demo, sample } = useDemo();
  const [imgUrl, setImgUrl] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [risk, setRisk] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function onFile(f) {
    setErr(null);
    setImgUrl(URL.createObjectURL(f));
    setPredictions([]);
    setBoxes([]);
    setRisk(null);
    setBusy(true);
    try {
      if (demo) {
        setPredictions(sample.classification.predictions);
        setBoxes(sample.detection.boxes);
        setRisk(sample.risk);
      } else {
        const [c, d, r] = await Promise.all([
          api.classify(f).catch(() => ({ predictions: [] })),
          api.detect(f).catch(() => ({ boxes: [] })),
          api
            .risk({ distance_km: 11000, country_risk: 0.42, source_concentration: 0.55 })
            .catch(() => null),
        ]);
        setPredictions(c.predictions || []);
        setBoxes(d.boxes || []);
        setRisk(r);
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <Uploader onFile={onFile} />
        {imgUrl && <ComponentOverlay imageUrl={imgUrl} boxes={boxes} />}
      </div>
      <div className="space-y-4">
        {busy && (
          <div className="rounded-2xl border border-border bg-panel p-4">
            <p className="mb-3 text-sm uppercase tracking-widest text-muted">
              running three models…
            </p>
            <Skeleton lines={4} />
          </div>
        )}
        {err && <p className="text-bad">{err}</p>}
        <ClassificationPanel predictions={predictions} />
        {risk && <RiskDashboard score={risk.score} contributors={risk.top_contributors} />}
        <SupplyChainGlobe arcs={[]} />
      </div>
    </div>
  );
}
