def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    body = r.get_json()
    assert body["status"] == "ok"
    assert set(body["models"]) == {"product_classifier", "detector", "risk_model"}


def test_root(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "endpoints" in r.get_json()
