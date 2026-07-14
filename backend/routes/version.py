"""GET /api/version — build + model-artifact fingerprint."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from flask import Blueprint, jsonify

bp = Blueprint("version", __name__)

_ART = Path(__file__).resolve().parents[2] / "ml" / "artifacts"


def _fingerprint(p: Path) -> str | None:
    if not p.exists():
        return None
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()[:12]


@bp.get("/version")
def version():
    metrics = {}
    for name, filename in [
        ("product_classifier", "product_clf_metrics.json"),
        ("risk_model", "risk_xgb_metrics.json"),
        ("detector", "detector_metrics.json"),
    ]:
        f = _ART / filename
        if f.exists():
            metrics[name] = json.loads(f.read_text())
    return jsonify(
        {
            "app_version": "0.1.0",
            "artifacts": {
                "product_clf.pt": _fingerprint(_ART / "product_clf.pt"),
                "detector.pt": _fingerprint(_ART / "detector.pt"),
                "risk_xgb.pkl": _fingerprint(_ART / "risk_xgb.pkl"),
            },
            "metrics": metrics,
        }
    )
