import { motion } from "framer-motion";
import { useState } from "react";
import ClassificationPanel from "../components/ClassificationPanel.jsx";
import ComponentOverlay from "../components/ComponentOverlay.jsx";
import RiskDashboard from "../components/RiskDashboard.jsx";
import RiskForm from "../components/RiskForm.jsx";
import Skeleton from "../components/Skeleton.jsx";
import SupplyChainGlobe from "../components/SupplyChainGlobe.jsx";
import Uploader from "../components/Uploader.jsx";
import { api } from "../lib/api.js";
import { useDemo } from "../lib/demoMode.jsx";

function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 text-center"
    >
      <h1 className="text-4xl font-bold sm:text-5xl">
        <span className="grad-text">Trace</span>{" "}
        <span className="text-ink">the invisible supply chain.</span>
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-muted sm:text-base">
        Three trained models. One photo, one country pick, and you see the risk,
        the components, and the story behind the product on your desk.
      </p>
    </motion.section>
  );
}

export default function Home() {
  const { demo, sample } = useDemo();
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [risk, setRisk] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onFile(f) {
    if (!f) return;
    setFile(f);
    setImgUrl(URL.createObjectURL(f));
    setPredictions([]);
    setBoxes([]);
    setBusy(true);
    try {
      if (demo) {
        setPredictions(sample.classification.predictions);
        setBoxes(sample.detection.boxes);
      } else {
        const [c, d] = await Promise.all([
          api.classify(f).catch(() => ({ predictions: [] })),
          api.detect(f).catch(() => ({ boxes: [] })),
        ]);
        setPredictions(c.predictions || []);
        setBoxes(d.boxes || []);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <Hero />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Uploader onFile={onFile} preview={imgUrl} />
          {imgUrl && (
            <ComponentOverlay imageUrl={imgUrl} boxes={boxes} />
          )}
        </div>

        <div className="space-y-4">
          {busy && (
            <div className="card p-5">
              <p className="mb-3 text-sm uppercase tracking-widest text-muted">
                running models…
              </p>
              <Skeleton lines={4} />
            </div>
          )}
          <ClassificationPanel predictions={predictions} />
          <RiskForm busy={busy} setBusy={setBusy} onResult={setRisk} />
          {risk && (
            <RiskDashboard
              score={risk.score}
              tier={risk.tier}
              contributors={risk.top_contributors}
              backend={risk.backend}
            />
          )}
          <SupplyChainGlobe arcs={[]} />
        </div>
      </div>
    </div>
  );
}
