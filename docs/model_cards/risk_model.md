# Model Card — Supply-Chain Risk Model

## Overview
- **Task:** regression, predict a supply-chain risk score in [0, 1] for a
  (product HS code, source country) pair.
- **Model:** XGBoost regressor, ~400 trees, depth 5.
- **Features (7):** `distance_km`, `tariff_pct`, `trade_value_log`,
  `country_risk` (WGI Political Stability, scaled), `source_concentration`
  (HHI), `historic_disruption_count`, `free_zone_flag`.
- **Target:** composite proxy — min-max scaled year-over-year trade volatility.
- **Explainability:** SHAP TreeExplainer. API returns top-3 contributors per
  prediction.

## Metrics (test set)
| Metric | Target | Actual |
|---|---|---|
| RMSE | ≤ 0.15 | *pending training run* |
| R² | ≥ 0.55 | *pending* |
| Latency (CPU) | ≤ 20ms | *pending* |

## Data
- UN Comtrade (HS 8471, 8517, 8542).
- World Bank Worldwide Governance Indicators (Political Stability).
- See `docs/DATA_CARD.md`.

## Intended use
- Consumer-facing risk score in the ChainScope demo.
- Educational visualisation of supply-chain fragility.

## Out of scope
- Real trading, procurement, or insurance decisions.
- Fine-grained shipment-level risk.

## Known limitations
- Volatility ≠ risk; a stable but high-tariff route reads as safe here.
- Only 7 features. A richer version would add ESG scores, port capacity,
  climate exposure.
- Countries missing from WGI are imputed with region median, biasing scores
  toward the median.
