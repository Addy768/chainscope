"""Headless XGBoost risk-model training.

Mirrors notebooks/06 but takes CLI args and writes artifacts. See the notebook
for narrative + hyperparameter search — this script uses the winning params.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

SEED = 42
ART = Path(__file__).resolve().parents[1] / "artifacts"
PROC = Path(__file__).resolve().parents[2] / "data" / "processed"

DEFAULT_PARAMS = {
    "max_depth": 5,
    "learning_rate": 0.05,
    "n_estimators": 400,
    "subsample": 0.85,
    "colsample_bytree": 0.85,
}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--features", default=str(PROC / "risk_features.parquet"))
    args = ap.parse_args()

    ART.mkdir(parents=True, exist_ok=True)
    df = pd.read_parquet(args.features)
    feats = [
        c
        for c in [
            "distance_km",
            "tariff_pct",
            "trade_value_log",
            "country_risk",
            "source_concentration",
            "historic_disruption_count",
            "free_zone_flag",
        ]
        if c in df.columns
    ]
    X, y = df[feats].fillna(0.0), df["y_risk_score"]
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=SEED)

    model = xgb.XGBRegressor(**DEFAULT_PARAMS, random_state=SEED, n_jobs=-1)
    model.fit(X_tr, y_tr)

    p_te = model.predict(X_te)
    rmse = float(np.sqrt(mean_squared_error(y_te, p_te)))
    r2 = float(r2_score(y_te, p_te))
    print(f"TEST rmse={rmse:.4f} r2={r2:.3f}")

    joblib.dump({"model": model, "features": feats}, ART / "risk_xgb.pkl")
    (ART / "risk_xgb_metrics.json").write_text(
        json.dumps(
            {"test_rmse": rmse, "test_r2": r2, "features": feats, "params": DEFAULT_PARAMS},
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
