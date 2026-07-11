"""Deterministic pipeline: data/raw/ -> data/processed/.

Reads raw CSVs and Kaggle images from data/raw/, produces:
  - processed/products.parquet    — one row per labelled product image
  - processed/countries.parquet   — WGI features per country
  - processed/trade_edges.parquet — supply-chain edge list

Seeded so re-runs from a clean data/raw/ produce byte-identical outputs.
"""
from __future__ import annotations

import sys
from pathlib import Path

SEED = 42
RAW = Path(__file__).parent / "raw"
PROCESSED = Path(__file__).parent / "processed"
PROCESSED.mkdir(parents=True, exist_ok=True)


def build_countries() -> None:
    """Reshape WGI CSV to one-row-per-country feature table."""
    # Implemented in commit 16 alongside supply-chain feature engineering.
    print("[todo] countries table — implemented in commit 16")


def build_products() -> None:
    """Index labelled product images into a manifest parquet."""
    # Implemented in commit 11 alongside the baseline classifier.
    print("[todo] products manifest — implemented in commit 11")


def build_trade_edges() -> None:
    """Aggregate Comtrade rows into (source, dest, value) edges."""
    print("[todo] trade edges — implemented in commit 16")


def main() -> int:
    print(f"Raw: {RAW}\nOut: {PROCESSED}")
    build_countries()
    build_products()
    build_trade_edges()
    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
