# Backend — ChainScope

Flask API that loads three trained model artifacts at boot and exposes
prediction endpoints.

## Endpoints (planned)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Liveness + model-registry status |
| POST | `/api/classify` | ResNet50 top-5 predictions |
| POST | `/api/detect-components` | YOLOv8 bounding boxes |
| POST | `/api/risk-score` | XGBoost score + top-3 SHAP contributors |

## Setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

Artifacts are expected under `../ml/artifacts/`. See `services/model_registry.py`.
