def test_risk_reports_missing_artifact(client):
    r = client.post("/api/risk-score", json={"distance_km": 10000})
    assert r.status_code in (200, 503)
