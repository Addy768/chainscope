# ChainScope

**ML-powered supply-chain transparency for consumer electronics.**
Upload a photo of a device, get a trained-model prediction of what it is,
a detector-drawn map of its components, and an XGBoost risk score for its
supply chain — with SHAP explanations for every number on screen.

> Aligned with UN SDG 12 (Responsible Consumption and Production).

---

## Why this project

Most "AI" side-projects are thin wrappers around a foundation-model API. This
one is the opposite: three trained models do the work, notebooks show how
they were built, and the LLM only shows up for optional text enrichment.

| Model | Task | Metric (target) |
|---|---|---|
| ResNet50 (fine-tuned) | Product classification | top-1 acc ≥ 0.80 |
| YOLOv8n (fine-tuned) | Component detection | mAP@0.5 ≥ 0.50 |
| XGBoost | Supply-chain risk score | RMSE ≤ 0.15 on [0,1] |

Every model ships with a **model card** (`docs/model_cards/`), every dataset
with a **data card** (`docs/DATA_CARD.md`), and every prediction with a
**SHAP** or confidence explanation.

## What's in the repo

- `notebooks/` — EDA, baselines, model training, interpretability
- `ml/` — training scripts, saved artifacts, regression tests
- `backend/` — Flask API that serves the artifacts
- `frontend/` — Vite + React + Tailwind UI
- `data/` — download + preprocessing pipeline (raw data gitignored)
- `docs/` — model cards, data card, evaluation, deployment

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for the design story and
[`COMMIT_PLAN.md`](COMMIT_PLAN.md) for the ~40-commit roadmap.

## Quick start

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py                          # http://localhost:5000

# Frontend
cd ../frontend
npm install
npm run dev                            # http://localhost:5173

# Train the models (optional — artifacts are gitignored)
cd ..
python data/download.py
jupyter lab notebooks/                 # walk through 01 → 08
```

## Tech stack

**Frontend** — React 18, Vite, Tailwind CSS, Framer Motion, react-globe.gl
**Backend** — Flask, PyTorch, Ultralytics YOLOv8, XGBoost, SHAP
**Data** — UN Comtrade, World Bank WGI, Kaggle electronics dataset,
Wikidata

## Status

Repository scaffold complete. Follow [`COMMIT_PLAN.md`](COMMIT_PLAN.md) for
the incremental build. Current phase: **Phase 1 — repo setup**.

## License

MIT — see [`LICENSE`](LICENSE).

## Credits

Inspired by the "Sourced" prototype from Sheridan Datathon 2025 — this is a
ground-up ML-first rebuild, not a fork.
