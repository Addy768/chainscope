"""POST /api/risk-score — risk regressor + top-3 SHAP contributors."""
from __future__ import annotations

from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

bp = Blueprint("risk", __name__)

_ART = Path(__file__).resolve().parents[2] / "ml" / "artifacts" / "risk_xgb.pkl"
_STATE: dict[str, Any] = {"loaded": False}


def _load():
    if _STATE["loaded"]:
        return
    import joblib
    import shap

    obj = joblib.load(_ART)
    _STATE.update(
        loaded=True,
        model=obj["model"],
        features=obj["features"],
        explainer=shap.TreeExplainer(obj["model"]),
    )


@bp.post("/risk-score")
def risk_score():
    payload = request.get_json(silent=True) or {}
    if not _ART.exists():
        return jsonify({"error": "model artifact missing"}), 503
    _load()

    import numpy as np
    import pandas as pd

    row = {f: float(payload.get(f, 0.0)) for f in _STATE["features"]}
    X = pd.DataFrame([row])
    score = float(_STATE["model"].predict(X)[0])

    sv = _STATE["explainer"](X)
    contribs = list(zip(_STATE["features"], sv.values[0].tolist()))
    contribs.sort(key=lambda kv: abs(kv[1]), reverse=True)
    top = [
        {"feature": k, "shap": round(v, 4), "direction": "up" if v > 0 else "down"}
        for k, v in contribs[:3]
    ]

    return jsonify(
        {
            "score": round(min(max(score, 0.0), 1.0), 4),
            "top_contributors": top,
            "features_used": _STATE["features"],
        }
    )
