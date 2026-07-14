# Evaluation — ChainScope

Test-set numbers for every model shipped with the demo. All artifacts are
regenerated end-to-end by running:

```bash
python data/download.py
python data/make_dataset.py
python ml/training/train_classifier.py --epochs 8
python ml/training/train_risk.py
# YOLOv8 trained via notebooks/08_component_detection_yolov8.ipynb
pytest ml/tests/
```

## Summary table

| Model | Task | Metric | Target | Result | Latency (CPU) |
|---|---|---|---|---|---|
| `product_clf.pt` | image classification | top-1 accuracy | ≥ 0.80 | *TBD* | ~80 ms |
| `product_clf.pt` | image classification | top-5 accuracy | ≥ 0.95 | *TBD* | — |
| `risk_xgb.pkl` | regression | RMSE | ≤ 0.15 | *TBD* | ~10 ms |
| `risk_xgb.pkl` | regression | R² | ≥ 0.55 | *TBD* | — |
| `detector.pt` | object detection | mAP@0.5 | ≥ 0.50 | *TBD* | ~250 ms |

Numbers marked *TBD* fill in once the training run completes. Regression
thresholds live in `ml/tests/test_artifacts.py` — CI fails if a retrain
drops below them.

## Figures

- `docs/figures/01_class_balance.png` — training-set class distribution
- `docs/figures/03_baseline_confusion.png` — HOG-baseline confusion matrix
- `docs/figures/06_calibration.png` — XGBoost calibration curve
- `docs/figures/07_shap_summary.png` — SHAP global importance
- `docs/figures/07_shap_waterfall_example.png` — SHAP local example

## Cross-checks

- **Baseline vs deep:** the ResNet50 model must beat the HOG/logistic
  baseline (~35% top-1) by at least 40 percentage points to justify the
  complexity.
- **Calibration:** predicted vs actual risk should sit within ±0.1 of the
  y = x line across binned deciles.
- **Robustness:** flipped / cropped images should not shift top-1 prediction
  in ≥ 90% of test samples (informal aug-invariance check).
