"""Pure-Python risk model with real domain logic.

Used when the XGBoost artifact is missing (e.g. torch not installed).
Same feature set as the trained model so the API contract stays stable.

Score is a weighted sigmoid over normalised features, with per-feature
contributions exposed to mimic the SHAP output of the real model.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

from services.country_data import lookup

# Weights chosen to reflect domain intuition. When the real XGBoost model
# lands, this becomes a fallback only.
_WEIGHTS: dict[str, float] = {
    "country_risk":              1.90,   # governance instability is the biggest driver
    "source_concentration":      1.25,   # single-source risk (HHI)
    "distance_km_scaled":        0.55,   # long transport routes = more disruption points
    "tariff_pct_scaled":         0.35,   # tariff friction
    "trade_value_log_scaled":   -0.20,   # high-volume trades tend to be resilient
    "historic_disruption_count": 0.85,   # past is prologue
    "free_zone_flag":            0.30,   # free-zone re-exports = provenance uncertainty
}

_BIAS = -1.2  # centres the sigmoid around ~mid-risk


def _sigmoid(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-x))


def _feature_row(payload: dict) -> dict[str, float]:
    """Build the feature dict from user inputs, enriching from static country data."""
    country = payload.get("source_country")
    static = lookup(country) if country else {}

    distance = float(payload.get("distance_km", static.get("distance_km", 11000.0)))
    tariff = float(payload.get("tariff_pct", static.get("tariff_pct", 5.0)))
    country_risk = float(payload.get("country_risk", static.get("country_risk", 0.45)))
    free_zone = 1.0 if payload.get("free_zone_flag", static.get("free_zone_flag", False)) else 0.0
    trade_value_log = float(payload.get("trade_value_log", 12.0))
    src_concentration = float(payload.get("source_concentration", 0.55))
    disruption = float(payload.get("historic_disruption_count", 2.0))

    return {
        "country_risk": country_risk,
        "source_concentration": src_concentration,
        # Scale features so they sit roughly in [0, 1]
        "distance_km_scaled": min(1.0, distance / 20000.0),
        "tariff_pct_scaled": min(1.0, tariff / 20.0),
        "trade_value_log_scaled": min(1.0, max(0.0, (trade_value_log - 8.0) / 8.0)),
        "historic_disruption_count": min(1.0, disruption / 10.0),
        "free_zone_flag": free_zone,
    }


@dataclass
class Contribution:
    feature: str
    value: float
    weight: float
    contribution: float

    @property
    def direction(self) -> str:
        return "up" if self.contribution > 0 else "down"

    def as_dict(self) -> dict:
        return {
            "feature": self.feature,
            "value": round(self.value, 4),
            "shap": round(self.contribution, 4),
            "direction": self.direction,
        }


def score(payload: dict) -> dict:
    """Compute a risk score in [0, 1] and per-feature contributions.

    Returns a dict shaped like the ML endpoint so the frontend does not
    need to know which model is serving.
    """
    features = _feature_row(payload)

    contribs: list[Contribution] = []
    logit = _BIAS
    for name, weight in _WEIGHTS.items():
        v = features[name]
        c = v * weight
        logit += c
        contribs.append(Contribution(name, v, weight, c))

    s = _sigmoid(logit)
    tier = "low" if s < 0.34 else "medium" if s < 0.67 else "high"

    top = sorted(contribs, key=lambda c: abs(c.contribution), reverse=True)[:3]

    return {
        "score": round(s, 4),
        "tier": tier,
        "top_contributors": [c.as_dict() for c in top],
        "features_used": list(_WEIGHTS.keys()),
        "backend": "rule_based_fallback",
    }
