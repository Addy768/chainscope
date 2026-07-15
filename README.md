# ChainScope

![ci](https://github.com/Addy768/chainscope/actions/workflows/ci.yml/badge.svg)
![license](https://img.shields.io/badge/license-MIT-blue)
![python](https://img.shields.io/badge/python-3.11-blue)
![node](https://img.shields.io/badge/node-20-green)

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
- `docs/` — model cards, data card, evaluation, deployment, architecture

Design notes in [`ARCHITECTURE.md`](ARCHITECTURE.md); phased build in
[`COMMIT_PLAN.md`](COMMIT_PLAN.md); visual system diagram in
[`docs/ARCHITECTURE_DIAGRAM.md`](docs/ARCHITECTURE_DIAGRAM.md).

## Quick start

```bash
make install
make serve                             # docker: api :5000, ui :5173
# or, without docker:
cd backend && python app.py &
cd frontend && npm run dev
```

Rebuild every model artifact end-to-end:

```bash
make train-all
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
| GET | `/api/version` | build + artifact fingerprints + latest metrics |
| POST | `/api/classify` | ResNet50 top-5 predictions |
| POST | `/api/detect-components` | YOLOv8 bounding boxes |
| POST | `/api/risk-score` | XGBoost score + top-3 SHAP contributors |

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Credits

Inspired by the "Sourced" prototype from Sheridan Datathon 2025 — this is
a ground-up ML-first rebuild rather than a fork. See
[`ARCHITECTURE.md`](ARCHITECTURE.md) for the side-by-side.

## License

MIT — see [`LICENSE`](LICENSE).
