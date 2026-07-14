"""Regression tests for saved model artifacts.

Only run when artifacts exist — CI does not train, but a nightly job that
retrains can call `pytest ml/tests/` as a smoke check that the artifacts
still meet the model-card thresholds.
"""
import json
from pathlib import Path

import pytest

ART = Path(__file__).resolve().parents[1] / "artifacts"


@pytest.mark.skipif(not (ART / "product_clf_metrics.json").exists(), reason="artifact missing")
def test_product_clf_meets_target():
    m = json.loads((ART / "product_clf_metrics.json").read_text())
    assert m["test_top1_accuracy"] >= 0.75, "regression: acc dropped below 0.75"


@pytest.mark.skipif(not (ART / "risk_xgb_metrics.json").exists(), reason="artifact missing")
def test_risk_model_meets_target():
    m = json.loads((ART / "risk_xgb_metrics.json").read_text())
    assert m["test_rmse"] <= 0.18, "regression: RMSE ballooned"


@pytest.mark.skipif(not (ART / "detector_metrics.json").exists(), reason="artifact missing")
def test_detector_meets_target():
    m = json.loads((ART / "detector_metrics.json").read_text())
    assert m["mAP50"] >= 0.45, "regression: mAP dropped"
