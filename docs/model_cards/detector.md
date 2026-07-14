# Model Card — Component Detector

## Overview
- **Task:** object detection — find internal components in teardown photos.
- **Model:** YOLOv8n (Ultralytics), fine-tuned from COCO weights.
- **Classes:** `battery`, `mainboard`, `camera`, `display`, `speaker`, `connector`.
- **Input:** 640×640 RGB.
- **Output:** bounding boxes with class + confidence.

## Data
- ~500 iFixit teardown images, manually annotated in LabelStudio.
- Split 80 / 20 train/val, seed 42.
- iFixit content is **CC BY-NC-SA** — non-commercial only. Weights are not
  redistributable for commercial use.

## Metrics (val)
| Metric | Target | Actual |
|---|---|---|
| mAP@0.5 | ≥ 0.50 | *pending training run* |
| mAP@0.5–0.95 | ≥ 0.30 | *pending* |
| Inference latency (CPU) | ≤ 300ms | *pending* |

## Intended use
Visualise component locations on uploaded teardown-style images in the demo.
**Not** intended for repair guidance or safety-critical decisions.

## Known limitations
- Very small training set — expect overfitting to Apple-heavy corpus.
- Confused by tight overlapping components.
- Falls apart on non-teardown photos (fully-assembled devices).

## Reproducibility
Run `notebooks/08_component_detection_yolov8.ipynb` end-to-end.
