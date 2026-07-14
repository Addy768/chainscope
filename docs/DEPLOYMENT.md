# Deployment — ChainScope

The demo is a two-service app. Both containers are stateless — model
artifacts are baked in at build time.

## Local (Docker Compose)

```bash
docker compose up --build
# frontend: http://localhost:5173
# api:      http://localhost:5000
```

## Backend → Google Cloud Run

```bash
cd backend
gcloud builds submit --tag gcr.io/<PROJECT>/chainscope-api
gcloud run deploy chainscope-api \
  --image gcr.io/<PROJECT>/chainscope-api \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --set-env-vars="CORS_ORIGINS=https://<your-frontend-domain>"
```

Model artifacts are ~200 MB (ResNet50 + YOLOv8n). If you don't want them in
the image, mount them from Cloud Storage instead and swap the paths in
`services/model_registry.py`.

## Frontend → Vercel

```bash
cd frontend
npm run build
# push the repo — Vercel auto-detects Vite. Set env var:
#   VITE_API_URL = https://<your-cloud-run-url>
```

## Env vars

| Variable | Where | Purpose |
|---|---|---|
| `PORT` | backend | HTTP port (Cloud Run injects this) |
| `CORS_ORIGINS` | backend | comma-separated allowed origins |
| `VITE_API_URL` | frontend | backend base URL, baked in at build |

## Smoke test

After deploy:

```bash
curl -f $BACKEND/api/health
curl -f -F "image=@test.jpg" $BACKEND/api/classify
```

If health is 200 and classify returns predictions, you're live.
