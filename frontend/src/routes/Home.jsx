import { useState } from "react";
import Uploader from "../components/Uploader.jsx";
import ClassificationPanel from "../components/ClassificationPanel.jsx";
import ComponentOverlay from "../components/ComponentOverlay.jsx";
import RiskDashboard from "../components/RiskDashboard.jsx";
import SupplyChainGlobe from "../components/SupplyChainGlobe.jsx";
import { api } from "../lib/api.js";

export default function Home() {
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [risk, setRisk] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function onFile(f) {
    setErr(null);
    setFile(f);
    setImgUrl(URL.createObjectURL(f));
    setPredictions([]);
    setBoxes([]);
    setRisk(null);
    setBusy(true);
    try {
      const [c, d, r] = await Promise.all([
        api.classify(f).catch(() => ({ predictions: [] })),
        api.detect(f).catch(() => ({ boxes: [] })),
        api
          .risk({
            distance_km: 11000,
            country_risk: 0.42,
            source_concentration: 0.55,
            trade_value_log: 12.3,
          })
          .catch(() => null),
      ]);
      setPredictions(c.predictions || []);
      setBoxes(d.boxes || []);
      setRisk(r);
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
        {busy && <p className="text-muted">running three models…</p>}
        {err && <p className="text-bad">{err}</p>}
        <ClassificationPanel predictions={predictions} />
        {risk && (
          <RiskDashboard
            score={risk.score}
            contributors={risk.top_contributors}
          />
        )}
        <SupplyChainGlobe arcs={[]} />
      </div>
    </div>
  );
}
