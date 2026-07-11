"""Liveness + model-registry status endpoint."""
from flask import Blueprint, jsonify

bp = Blueprint("health", __name__)


@bp.get("/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "models": {
                "product_classifier": "not_loaded",
                "detector": "not_loaded",
                "risk_model": "not_loaded",
            },
        }
    )
