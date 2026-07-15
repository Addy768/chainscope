"""POST /api/risk-score — always returns a real answer.

Priority:
1. Trained XGBoost artifact (if present) — real ML with SHAP.
2. Pure-Python rule-based fallback — same contract, honest weights.
"""
from __future__ import annotations

from pathlib import Path
from typing import Any

from flask import Blueprint, jsonify, request

from services.risk_model import score as fallback_score

bp = Blueprint("risk", __name__)

_ART = Path(__file__).resolve().parents[2] / "ml" / "artifacts" / "risk_xgb.pkl"
_STATE: dict[str, Any] = {"loaded": False}


def _try_load_ml():
    if _STATE["loaded"] or not _ART.exists():
        return
    try:
        import joblib
        import shap

        obj = joblib.load(_ART)
        _STATE.update(
            loaded=True,
            model=obj["model"],
            features=obj["features"],
            explainer=shap.TreeExplainer(obj["model"]),
        )
    except Exception:
        # Any import / load failure → stick with the fallback
        _STATE["loaded"] = False


@bp.get("/risk-score/schema")
def schema():
    """Advertise the input schema + supported countries so the UI can render a form."""
    from services.country_data import all_countries

    return jsonify(
        {
            "fields": [
                {"name": "source_country", "type": "enum", "options": all_countries()},
                {"name": "product_hs", "type": "enum", "options": ["8471", "8517", "8542"]},
                {"name": "source_concentration", "type": "float", "min": 0, "max": 1, "default": 0.55},
                {"name": "historic_disruption_count", "type": "int", "min": 0, "max": 20, "default": 2},
                {"name": "trade_value_log", "type": "float", "min": 6, "max": 18, "default": 12},
            ],
            "backend": "ml_if_available_else_rule_based",
        }
    )


@bp.post("/risk-score")
def risk_score():
    payload = request.get_json(silent=True) or {}
    _try_load_ml()

    if _STATE.get("loaded"):
        import numpy as np  # noqa: F401
        import pandas as pd

        from services.country_data import lookup as country_lookup

        # Enrich payload with country-derived features
        static = country_lookup(payload.get("source_country", "")) or {}
        row = {
            f: float(payload.get(f, static.get(f, 0.0))) for f in _STATE["features"]
        }
        X = pd.DataFrame([row])
        s = float(_STATE["model"].predict(X)[0])

        sv = _STATE["explainer"](X)
        contribs = list(zip(_STATE["features"], sv.values[0].tolist()))
        contribs.sort(key=lambda kv: abs(kv[1]), reverse=True)
        top = [
            {"feature": k, "shap": round(v, 4), "direction": "up" if v > 0 else "down"}
            for k, v in contribs[:3]
        ]

        return jsonify(
            {
                "score": round(min(max(s, 0.0), 1.0), 4),
                "tier": "low" if s < 0.34 else "medium" if s < 0.67 else "high",
                "top_contributors": top,
                "features_used": _STATE["features"],
                "backend": "xgboost",
            }
        )

    # Fallback path — always works
    return jsonify(fallback_score(payload))
