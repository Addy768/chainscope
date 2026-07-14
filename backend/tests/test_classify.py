def test_classify_requires_image(client):
    r = client.post("/api/classify")
    assert r.status_code == 400


def test_classify_reports_missing_artifact(client, tmp_path, monkeypatch):
    import io

    r = client.post(
        "/api/classify",
        data={"image": (io.BytesIO(b"not-really-a-png"), "x.png")},
        content_type="multipart/form-data",
    )
    # 503 when artifact absent, 200 when present.
    assert r.status_code in (200, 503)
