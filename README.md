# ChainScope

**ML-powered supply-chain transparency for consumer electronics.**
Upload a photo of a device, get a trained-model prediction of what it is,
a detector-drawn map of its components, and an XGBoost risk score for its
supply chain — with SHAP explanations behind every number on screen.

> Aligned with UN SDG 12 (Responsible Consumption and Production).

---

## The three models

| Model | Task | Metric target |
|---|---|---|
| ResNet50 (fine-tuned) | product classification | top-1 accuracy ≥ 0.80 |
| YOLOv8n (fine-tuned) | component detection | mAP@0.5 ≥ 0.50 |
| XGBoost | supply-chain risk regressor | RMSE ≤ 0.15 |

Every model ships with a **model card** (`docs/model_cards/`), every
dataset with a **data card** (`docs/DATA_CARD.md`), and every prediction
with a **confidence** or **SHAP** explanation.

## What's here

- `notebooks/` — EDA, baselines, model training, interpretability (01–08)
- `ml/` — headless training scripts, saved artifacts, regression tests
- `backend/` — Flask API serving the three artifacts
- `frontend/` — Vite + React + Tailwind UI (analyst-console dark theme)
- `data/` — download + preprocessing pipeline (raw data gitignored)
- `docs/` — model cards, data card, evaluation, deployment

Design notes in [`ARCHITECTURE.md`](ARCHITECTURE.md); phased build in
[`COMMIT_PLAN.md`](COMMIT_PLAN.md).

## Quick start

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py                          # http://localhost:5000

# Frontend
cd ../frontend
npm install
npm run dev                            # http://localhost:5173

# Rebuild all artifacts (optional, needs GPU for reasonable YOLO time)
python data/download.py
python data/make_dataset.py
jupyter lab notebooks/                 # walk through 01 → 08
```

Or, all-in-one:

```bash
docker compose up --build
```

## Tech stack

- **Frontend** — React 18, Vite, Tailwind CSS, react-router, react-globe.gl
- **Backend** — Flask, PyTorch (ResNet50), Ultralytics YOLOv8, XGBoost, SHAP
- **Data** — UN Comtrade, World Bank WGI, Kaggle electronics dataset,
  iFixit teardowns, Wikidata

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | model registry status |
| POST | `/api/classify` | ResNet50 top-5 predictions |
| POST | `/api/detect-components` | YOLOv8 bounding boxes |
| POST | `/api/risk-score` | XGBoost score + top-3 SHAP contributors |

## Credits

Inspired by the "Sourced" prototype from Sheridan Datathon 2025 — this is
a ground-up ML-first rebuild rather than a fork. See
[`ARCHITECTURE.md`](ARCHITECTURE.md) for the side-by-side.

## License

MIT — see [`LICENSE`](LICENSE).
