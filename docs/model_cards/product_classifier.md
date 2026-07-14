# Model Card — Product Classifier

## Overview
- **Task:** multi-class image classification of consumer electronics.
- **Architecture:** ResNet50 (ImageNet V2 weights) + new 10-way linear head.
- **Training:** 2-stage — freeze backbone → head-only, then unfreeze `layer4` with lower LR.
- **Loss:** cross-entropy with label smoothing (0.05).
- **Input:** 224×224 RGB, ImageNet normalisation.
- **Output:** softmax over `{smartphone, laptop, tablet, headphones, camera, speaker, monitor, printer, keyboard, mouse}`.

## Data
- **Source:** Kaggle Electronics Product Images (see `docs/DATA_CARD.md`).
- **Split:** 80 / 10 / 10 stratified, seed 42.
- **Augmentation:** random crop, horizontal flip, colour jitter.

## Metrics (test set)
Populated by `ml/training/train_classifier.py` into `ml/artifacts/product_clf_metrics.json`.

| Metric | Target | Actual |
|---|---|---|
| Top-1 accuracy | ≥ 0.80 | *pending first training run* |
| Top-5 accuracy | ≥ 0.95 | *pending* |
| Inference latency (CPU) | ≤ 100ms | *pending* |

## Intended use
Serve the `/api/classify` endpoint of the ChainScope demo. **Not** intended for
industrial identification, brand disambiguation, or counterfeit detection.

## Known limitations
- **Studio-shot bias.** Training photos are mostly white-background product
  shots; real-world uploads with clutter degrade accuracy.
- **Western-brand skew.** Underrepresented brands from other markets classify
  worse.
- **Class overlap.** Laptops with a phone in frame occasionally confuse the
  model.

## Ethical considerations
- Model outputs are non-authoritative. Confidence scores are exposed to the UI
  so users can judge reliability.
- Personally identifiable information may appear in uploaded photos — the API
  never persists uploads (see `backend/routes/classify.py`).

## Reproducibility
```bash
python data/download.py
python data/make_dataset.py
python ml/training/train_classifier.py --epochs 8
```
Seed 42 across split and model init.
