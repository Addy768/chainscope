# SETUP — Running ChainScope locally

## Prereqs

- Python 3.11
- Node 20
- (optional) Docker Desktop
- (optional) NVIDIA GPU + CUDA for reasonable YOLOv8 training speed

## 1. Clone

```bash
git clone https://github.com/Addy768/chainscope.git
cd chainscope
```

## 2. Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

Backend at http://localhost:5000. Endpoints under `/api/*`.
Without model artifacts, `/api/classify` etc. return `503` with a hint —
that's fine; use **demo mode** (see below) to browse the UI.

## 3. Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Click **demo off → demo on** in the top-right to
use bundled sample predictions instead of the backend.

## 4. Docker (both services)

```bash
docker compose up --build
```

## 5. Training the models

```bash
make train-all
```

Or step by step:

```bash
python data/download.py
python data/make_dataset.py
python ml/training/train_classifier.py --epochs 8
python ml/training/train_risk.py
jupyter lab notebooks/08_component_detection_yolov8.ipynb   # for YOLO
```

Artifacts land in `ml/artifacts/`. Restart the backend to pick them up.

## 6. Tests

```bash
make test
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| `/api/classify → 503` | Train the model or turn on demo mode in the UI. |
| `torch install too slow` | Use CPU wheel: `pip install torch --index-url https://download.pytorch.org/whl/cpu` |
| Windows filemode noise | `git config core.fileMode false` |
| CORS error in browser | Check `CORS_ORIGINS` in `backend/.env`. |
