"""POST /api/detect-components — YOLOv8 bounding boxes."""
from __future__ import annotations

import io
from pathlib import Path

from flask import Blueprint, jsonify, request

bp = Blueprint("detect", __name__)

_ART = Path(__file__).resolve().parents[2] / "ml" / "artifacts" / "detector.pt"
_STATE: dict = {"loaded": False}


def _load():
    if _STATE["loaded"]:
        return
    from ultralytics import YOLO

    _STATE["model"] = YOLO(str(_ART))
    _STATE["loaded"] = True


@bp.post("/detect-components")
def detect():
    if "image" not in request.files:
        return jsonify({"error": "field 'image' required"}), 400
    if not _ART.exists():
        return jsonify(
            {"error": "detector artifact missing", "hint": "train via notebooks/08"}
        ), 503
    _load()

    from PIL import Image

    img = Image.open(io.BytesIO(request.files["image"].read())).convert("RGB")
    res = _STATE["model"].predict(img, verbose=False)[0]
    boxes = []
    for b, c, cls in zip(res.boxes.xyxy.tolist(), res.boxes.conf.tolist(), res.boxes.cls.tolist()):
        boxes.append(
            {
                "label": res.names[int(cls)],
                "confidence": round(float(c), 4),
                "bbox": [round(v, 1) for v in b],
            }
        )
    return jsonify({"boxes": boxes, "image_size": img.size})
