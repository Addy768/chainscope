# Notebooks — ChainScope

Each notebook reads like a short data-science report: **motivation → data →
method → results**. No dead cells, no `TODO`s left in.

| # | Notebook | Purpose |
|---|---|---|
| 01 | `01_eda_products.ipynb` | Class balance, image size distribution, sample grid |
| 02 | `02_eda_supply_chain.ipynb` | Country counts, material frequencies, geo heatmap |
| 03 | `03_baseline_classifier.ipynb` | Logistic regression + SVM on HOG features |
| 04 | `04_cnn_transfer_learning.ipynb` | ResNet50 fine-tune with augmentation + LR sweep |
| 05 | `05_supply_chain_features.ipynb` | Feature engineering for the risk model |
| 06 | `06_xgboost_risk_model.ipynb` | XGBoost + hyperopt, CV, calibration curve |
| 07 | `07_shap_interpretability.ipynb` | Global + local SHAP plots |
| 08 | `08_component_detection_yolov8.ipynb` | YOLOv8n fine-tune on teardown images |

Run in order — later notebooks depend on artifacts written by earlier ones.
Use `nbstripout` (via pre-commit) so committed notebooks stay diff-friendly.
