# Commit Plan — ChainScope

> A roadmap of small, atomic commits designed to look great in `git log` and
> tell a clear story: data → EDA → baselines → real models → API → UI → ship.
>
> Rename any commit or project name you want. Project working name: **ChainScope**.

---

## Why small commits?

Recruiters skim `git log --oneline`. A history full of `wip`, `fix`, `update`
looks amateur. Each commit below is **one focused change** with a
conventional-commit prefix (`feat:`, `chore:`, `docs:`, `test:`, `ml:`, `data:`,
`notebooks:`). Ship one commit per work session if you can.

Target: ~40 commits, ~3–5 weeks of casual work.

---

## Phase 1 — Repo setup (commits 1–5)

| # | Commit | What lands |
|---|---|---|
| 1 | `chore: initial project scaffold` | Folders, README, LICENSE, .gitignore (this handoff) |
| 2 | `docs: add architecture and commit plan` | ARCHITECTURE.md + COMMIT_PLAN.md (this handoff) |
| 3 | `chore(backend): scaffold Flask app skeleton` | `backend/app.py`, `requirements.txt`, `.env.example` |
| 4 | `chore(frontend): scaffold Vite + React + Tailwind` | `npm create vite` + tailwind init |
| 5 | `chore: add pre-commit (black, ruff, prettier)` | `.pre-commit-config.yaml` |

## Phase 2 — Data collection & EDA (commits 6–10) — **resume gold**

| # | Commit | What lands |
|---|---|---|
| 6 | `data: add dataset download scripts` | `data/download.py` pulls electronics image dataset + UN Comtrade CSV |
| 7 | `notebooks: 01_eda_products.ipynb` | Class balance, image size distribution, sample grid |
| 8 | `notebooks: 02_eda_supply_chain.ipynb` | Country counts, material frequencies, geo heatmap |
| 9 | `data: processed dataset export pipeline` | `data/make_dataset.py` → `data/processed/*.parquet` |
| 10 | `docs: add DATA_CARD.md` | Sources, licenses, known biases |

## Phase 3 — Product classifier (commits 11–15)

| # | Commit | What lands |
|---|---|---|
| 11 | `notebooks: 03_baseline_classifier.ipynb` | Logistic regression + SVM on HOG features |
| 12 | `notebooks: 04_cnn_transfer_learning.ipynb` | ResNet50 fine-tune, aug pipeline, LR sweep |
| 13 | `ml: export product classifier artifact` | `ml/artifacts/product_clf.pt` + `metrics.json` |
| 14 | `docs: add product_classifier model card` | `docs/model_cards/product_classifier.md` |
| 15 | `feat(backend): POST /api/classify endpoint` | Loads artifact, returns top-5 with confidences |

## Phase 4 — Supply-chain risk model (commits 16–20)

| # | Commit | What lands |
|---|---|---|
| 16 | `notebooks: 05_supply_chain_features.ipynb` | Feature engineering: country risk index, distance, tariffs |
| 17 | `notebooks: 06_xgboost_risk_model.ipynb` | XGBoost + hyperopt, CV, calibration curve |
| 18 | `notebooks: 07_shap_interpretability.ipynb` | Global + local SHAP plots exported to `docs/figures/` |
| 19 | `ml: export risk model + card` | `ml/artifacts/risk_xgb.pkl`, `docs/model_cards/risk_model.md` |
| 20 | `feat(backend): POST /api/risk-score endpoint` | Returns score + top-3 SHAP contributors |

## Phase 5 — Component detection (commits 21–24)

| # | Commit | What lands |
|---|---|---|
| 21 | `notebooks: 08_component_detection_yolov8.ipynb` | Fine-tune YOLOv8n on labelled teardown images |
| 22 | `ml: export detector weights` | `ml/artifacts/detector.pt` + mAP metrics |
| 23 | `feat(backend): POST /api/detect-components` | Returns bounding boxes + labels |
| 24 | `docs: add detector model card` | `docs/model_cards/detector.md` |

## Phase 6 — Frontend (commits 25–32)

| # | Commit | What lands |
|---|---|---|
| 25 | `feat(frontend): image upload with drag-drop` | react-dropzone + preview |
| 26 | `feat(frontend): classification results panel` | Top-5 bars + confidence |
| 27 | `feat(frontend): bounding-box overlay for components` | Canvas overlay on uploaded image |
| 28 | `feat(frontend): supply chain globe (react-globe.gl)` | Arcs for material flows |
| 29 | `feat(frontend): risk score dashboard` | Gauge + SHAP waterfall |
| 30 | `feat(frontend): metrics page` | Live model metrics + confusion matrix |
| 31 | `style: dark theme + design tokens` | **Distinct visual identity from Sourced** |
| 32 | `feat(frontend): route + navbar polish` | React Router, shell layout |

## Phase 7 — Testing & CI (commits 33–36)

| # | Commit | What lands |
|---|---|---|
| 33 | `test(backend): pytest for all endpoints` | `backend/tests/` |
| 34 | `test(ml): model regression + latency tests` | `ml/tests/test_artifacts.py` |
| 35 | `ci: GitHub Actions — lint + test + build` | `.github/workflows/ci.yml` |
| 36 | `chore: Docker + docker-compose` | `Dockerfile`s + `compose.yml` |

## Phase 8 — Docs & polish (commits 37–40)

| # | Commit | What lands |
|---|---|---|
| 37 | `docs: EVALUATION.md summarizing model metrics` | Table with acc / F1 / mAP / latency |
| 38 | `docs: DEPLOYMENT.md (Cloud Run + Vercel)` | Copy-paste-friendly guide |
| 39 | `docs: add screenshots and demo GIF to README` | `docs/media/*.gif` |
| 40 | `chore: tag v1.0.0` | Annotated git tag |

---

## Commit message conventions

Follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <subject>

<body — why, not what>
```

Types used above: `feat`, `chore`, `docs`, `test`, `ci`, `style`, `ml`, `data`,
`notebooks`. Keep the subject line ≤ 72 chars, lowercase, no trailing period.

## Habits that make the log look pro

1. **One concern per commit.** If you find yourself typing " and " in the message, split it.
2. **Rebase, don't merge, for solo branches.** `git pull --rebase`.
3. **Squash noisy WIP commits before pushing.** `git rebase -i`.
4. **Tag releases.** `git tag -a v0.1.0 -m "MVP"`.
5. **Write bodies for anything non-obvious.** Explains *why* to future you.
