# Architecture — ChainScope

> Same theme as *Sourced* (electronics supply-chain transparency, UN SDG 12),
> same stack (React + Flask), but a **fundamentally different technical story**.
> Sourced is an LLM wrapper. ChainScope is an ML system.

---

## The pivot in one sentence

> **Sourced** identifies products by asking Gemini Vision. **ChainScope**
> identifies products with a CNN we trained ourselves, scores supply-chain
> risk with an XGBoost model we built on real trade data, and detects
> components with a fine-tuned YOLO — all with metrics, model cards, and
> SHAP explanations to back them up.

The LLM is still there for supplementary text research, but it is no longer
doing the ML work. That's the resume story.

---

## Side-by-side

| Concern | Sourced (original) | ChainScope (this build) |
|---|---|---|
| Product ID | Gemini Vision API call | **Fine-tuned ResNet50** on curated dataset |
| Components | Gemini text prompt for positions | **YOLOv8 detector** trained on teardown images |
| 3D model | SAM 3D Objects service call | Static parametric mesh generated from detected components |
| Supply-chain data | Gemini + Google Search grounding | **XGBoost risk model** on UN Comtrade + WGI features |
| Explainability | None | **SHAP** waterfall per prediction |
| Reproducibility | Config-free | Seeded splits, `DATA_CARD.md`, `MODEL_CARDS/` |
| Evaluation | None | `EVALUATION.md` with test-set metrics + latency |
| Theme visuals | Light / SDG green | Dark / analyst-console aesthetic (distinct look) |

---

## High-level flow

```
        ┌──────────────┐
Upload  │  Frontend    │ image + user context
──────► │  (React/Vite)│───────────────┐
        └──────────────┘               ▼
                                ┌────────────────┐
                                │  Flask API     │
                                │  /api/classify │
                                │  /api/detect   │
                                │  /api/risk     │
                                └───┬────────────┘
                                    │ load .pt / .pkl artifacts at boot
                                    ▼
                    ┌────────────────────────────────┐
                    │  ml/artifacts/                 │
                    │   ├─ product_clf.pt   (CNN)    │
                    │   ├─ detector.pt      (YOLO)   │
                    │   └─ risk_xgb.pkl     (XGB)    │
                    └────────────────────────────────┘
                              ▲
                              │ produced by
                              │
                    ┌────────────────────────────────┐
                    │  notebooks/                    │
                    │   01_eda_products              │
                    │   02_eda_supply_chain          │
                    │   03_baseline_classifier       │
                    │   04_cnn_transfer_learning     │
                    │   05_supply_chain_features     │
                    │   06_xgboost_risk_model        │
                    │   07_shap_interpretability     │
                    │   08_component_detection_yolo  │
                    └────────────────────────────────┘
```

The **notebooks are the artifact** for the resume. They should read like a
short data-science report each: motivation → data → method → results.

---

## Repo layout

```
chainscope/
├── README.md               # story-first, screenshots, metrics
├── ARCHITECTURE.md         # this file
├── COMMIT_PLAN.md          # roadmap of small commits
├── LICENSE
├── .gitignore
├── .pre-commit-config.yaml
├── .github/workflows/ci.yml
│
├── backend/                # Flask API — thin wrapper around loaded models
│   ├── app.py
│   ├── routes/
│   │   ├── classify.py
│   │   ├── detect.py
│   │   ├── risk.py
│   │   └── health.py
│   ├── services/
│   │   ├── model_registry.py   # loads artifacts on boot
│   │   └── explain.py          # SHAP wrapper
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/               # Vite + React + Tailwind
│   ├── src/
│   │   ├── App.jsx
│   │   ├── routes/         # / , /metrics , /about
│   │   └── components/
│   │       ├── Uploader.jsx
│   │       ├── ClassificationPanel.jsx
│   │       ├── ComponentOverlay.jsx
│   │       ├── RiskDashboard.jsx      # gauge + SHAP waterfall
│   │       ├── SupplyChainGlobe.jsx
│   │       └── MetricsPage.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── data/
│   ├── raw/                # gitignored — pulled by download.py
│   ├── processed/          # gitignored — parquet outputs
│   ├── download.py
│   └── make_dataset.py
│
├── ml/
│   ├── artifacts/          # gitignored large files, DVC-tracked
│   ├── training/
│   │   ├── train_classifier.py
│   │   ├── train_detector.py
│   │   └── train_risk.py
│   └── tests/
│       └── test_artifacts.py
│
├── notebooks/
│   ├── 01_eda_products.ipynb
│   ├── 02_eda_supply_chain.ipynb
│   ├── 03_baseline_classifier.ipynb
│   ├── 04_cnn_transfer_learning.ipynb
│   ├── 05_supply_chain_features.ipynb
│   ├── 06_xgboost_risk_model.ipynb
│   ├── 07_shap_interpretability.ipynb
│   └── 08_component_detection_yolov8.ipynb
│
└── docs/
    ├── DATA_CARD.md
    ├── EVALUATION.md
    ├── DEPLOYMENT.md
    ├── model_cards/
    │   ├── product_classifier.md
    │   ├── risk_model.md
    │   └── detector.md
    ├── figures/            # exported plots for README + docs
    └── media/              # screenshots + demo GIF
```

---

## Data sources (all open, all attributable)

| Source | Used for | License |
|---|---|---|
| **Kaggle Electronics Product Images** | Product classifier training set | CC0 / dataset-specific |
| **UN Comtrade** (trade flows) | Supply-chain risk features | UN Open Data |
| **World Bank WGI** (governance indicators) | Country risk features | CC-BY 4.0 |
| **iFixit teardown images** (scraped, small subset) | Component detection | Educational fair use — cite source |
| **Wikidata** (product metadata) | Cross-reference labels | CC0 |

Attribution and per-source dataset splits documented in `docs/DATA_CARD.md`.

---

## Modeling summary

### 1. Product classifier
- Input: 224×224 RGB
- Backbone: ResNet50 (ImageNet weights), classifier head fine-tuned
- Loss: cross-entropy with label smoothing
- Target metric: top-1 accuracy on held-out test set ≥ 0.80
- Baseline for comparison: logistic regression on HOG features (~0.35 expected)

### 2. Component detector
- Backbone: YOLOv8n
- Classes: `battery, mainboard, camera, display, speaker, connector, ...`
- Small labelled subset (~500 boxes) — annotate with LabelStudio or Roboflow
- Target: mAP@0.5 ≥ 0.50 (low bar because the dataset is small — that's honest)

### 3. Supply-chain risk model
- Input features per (product, source_country):
  `country_wgi, distance_km, tariff_pct, trade_volume_log, material_scarcity_index, historic_disruption_count`
- Model: XGBoost regressor → risk score in [0, 1]
- Interpretability: SHAP TreeExplainer, top-3 contributors returned by the API

---

## What makes this ML-first (not LLM-first)

1. **Every prediction has a metric behind it.** `docs/EVALUATION.md` lists
   test-set numbers with confidence intervals.
2. **Every model has a model card.** Intended use, training data, limitations,
   ethical considerations.
3. **Every notebook tells a story.** No dead cells, no `TODO`s left in.
   Markdown headers guide a reader top-to-bottom.
4. **Reproducibility is checked in.** Seeded splits, pinned versions, a
   `Makefile` target (`make train-all`) that rebuilds all artifacts.
5. **SHAP explanations in the UI.** Recruiters land on the demo and
   immediately see model interpretability, not a black box.

---

## What we drop from Sourced (and why)

- **SAM 3D Objects.** Requires a GPU with 8 GB VRAM to run — not worth the
  ops burden. A parametric mesh assembled from detected components tells the
  same story with less infra.
- **Gemini as the primary reasoner.** Kept only as an optional
  `text-research` endpoint for enrichment, off by default.

---

## What we keep

- The theme (electronics + SDG 12).
- React + Flask.
- The globe visualization (`react-globe.gl`) — it's genuinely the best
  visual.
- The image-upload → results → deeper-dive UX pattern.
