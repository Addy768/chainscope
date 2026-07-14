"""Train the product-image classifier headlessly.

Usage:
  python ml/training/train_classifier.py --epochs 8 --batch 32

Saves to ml/artifacts/product_clf.pt and ml/artifacts/product_clf_metrics.json.
This is a headless mirror of the flow in notebooks/04_cnn_transfer_learning.ipynb.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, models, transforms

SEED = 42
ART = Path(__file__).resolve().parents[1] / "artifacts"
DATA = Path(__file__).resolve().parents[2] / "data" / "raw" / "products"


def build_loaders(batch: int):
    tr_tf = transforms.Compose(
        [
            transforms.Resize(256),
            transforms.RandomCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(0.2, 0.2, 0.2),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )
    ev_tf = transforms.Compose(
        [
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )
    full = datasets.ImageFolder(DATA, transform=tr_tf)
    n_tr = int(0.8 * len(full))
    n_va = int(0.1 * len(full))
    n_te = len(full) - n_tr - n_va
    g = torch.Generator().manual_seed(SEED)
    tr, va, te = random_split(full, [n_tr, n_va, n_te], generator=g)
    return (
        DataLoader(tr, batch_size=batch, shuffle=True, num_workers=2),
        DataLoader(va, batch_size=batch * 2, num_workers=2),
        DataLoader(te, batch_size=batch * 2, num_workers=2),
        full.classes,
    )


def make_model(n_classes: int) -> nn.Module:
    net = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)
    for p in net.parameters():
        p.requires_grad = False
    net.fc = nn.Linear(net.fc.in_features, n_classes)
    return net


def run_epoch(net, loader, device, crit, opt=None):
    train = opt is not None
    net.train(train)
    tot = correct = 0
    loss_sum = 0.0
    for x, y in loader:
        x, y = x.to(device), y.to(device)
        with torch.set_grad_enabled(train):
            out = net(x)
            loss = crit(out, y)
            if train:
                opt.zero_grad()
                loss.backward()
                opt.step()
        loss_sum += loss.item() * x.size(0)
        tot += x.size(0)
        correct += (out.argmax(1) == y).sum().item()
    return loss_sum / tot, correct / tot


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--epochs", type=int, default=8)
    ap.add_argument("--batch", type=int, default=32)
    args = ap.parse_args()

    torch.manual_seed(SEED)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"device={device}")

    ART.mkdir(parents=True, exist_ok=True)
    dl_tr, dl_va, dl_te, classes = build_loaders(args.batch)
    net = make_model(len(classes)).to(device)
    crit = nn.CrossEntropyLoss(label_smoothing=0.05)
    opt = torch.optim.AdamW(net.fc.parameters(), lr=3e-4)

    for e in range(args.epochs // 2):
        _, ta = run_epoch(net, dl_tr, device, crit, opt)
        _, va = run_epoch(net, dl_va, device, crit)
        print(f"head ep{e} tr={ta:.3f} val={va:.3f}")

    for p in net.layer4.parameters():
        p.requires_grad = True
    opt = torch.optim.AdamW(
        [
            {"params": net.layer4.parameters(), "lr": 1e-5},
            {"params": net.fc.parameters(), "lr": 1e-4},
        ]
    )
    for e in range(args.epochs - args.epochs // 2):
        _, ta = run_epoch(net, dl_tr, device, crit, opt)
        _, va = run_epoch(net, dl_va, device, crit)
        print(f"ft ep{e} tr={ta:.3f} val={va:.3f}")

    _, te_acc = run_epoch(net, dl_te, device, crit)
    print(f"TEST top-1 = {te_acc:.3f}")

    torch.save({"state_dict": net.state_dict(), "classes": classes}, ART / "product_clf.pt")
    (ART / "product_clf_metrics.json").write_text(
        json.dumps(
            {"test_top1_accuracy": te_acc, "classes": classes, "model": "resnet50-ft"},
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
