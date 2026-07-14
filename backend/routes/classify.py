"""POST /api/classify — top-5 product predictions.

Loads the artifact lazily on first call so unit tests can run without it.
"""
from __future__ import annotations

import io
from pathlib import Path

from flask import Blueprint, jsonify, request

bp = Blueprint("classify", __name__)

_ARTIFACT = (
    Path(__file__).resolve().parents[2] / "ml" / "artifacts" / "product_clf.pt"
)
_STATE: dict = {"loaded": False, "net": None, "classes": None}


def _load():
    if _STATE["loaded"]:
        return
    import torch
    from torchvision import models

    ckpt = torch.load(_ARTIFACT, map_location="cpu")
    classes = ckpt["classes"]
    net = models.resnet50()
    net.fc = torch.nn.Linear(net.fc.in_features, len(classes))
    net.load_state_dict(ckpt["state_dict"])
    net.eval()
    _STATE.update(loaded=True, net=net, classes=classes)


def _preprocess(raw: bytes):
    from PIL import Image
    from torchvision import transforms

    img = Image.open(io.BytesIO(raw)).convert("RGB")
    tf = transforms.Compose(
        [
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )
    return tf(img).unsqueeze(0)


@bp.post("/classify")
def classify():
    if "image" not in request.files:
        return jsonify({"error": "field 'image' required"}), 400
    if not _ARTIFACT.exists():
        return jsonify(
            {"error": "model artifact missing", "hint": "run ml/training/train_classifier.py"}
        ), 503
    _load()
    import torch

    x = _preprocess(request.files["image"].read())
    with torch.no_grad():
        probs = torch.softmax(_STATE["net"](x), dim=1)[0]
    top = torch.topk(probs, k=5)
    predictions = [
        {"label": _STATE["classes"][i.item()], "confidence": round(v.item(), 4)}
        for v, i in zip(top.values, top.indices)
    ]
    return jsonify({"predictions": predictions})
