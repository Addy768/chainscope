"""Download raw datasets into data/raw/.

Sources
-------
- UN Comtrade sample (electronics HS codes 8471, 8517) — trade flows
- World Bank WGI (governance indicators) — country risk features
- Kaggle electronics product images — classifier training data
  (requires KAGGLE_USERNAME + KAGGLE_KEY env vars)

All downloads are idempotent — re-running does not re-fetch existing files.
See docs/DATA_CARD.md for licenses and attribution.
"""
from __future__ import annotations

import os
import sys
import urllib.request
from pathlib import Path

RAW = Path(__file__).parent / "raw"
RAW.mkdir(parents=True, exist_ok=True)

SEED = 42


SOURCES = {
    # World Bank WGI — CC-BY 4.0
    "wgi.csv": "https://databank.worldbank.org/data/download/WGI_csv.zip",
    # UN Comtrade — public API sample dump (placeholder — real fetch in commit 9)
    "comtrade_electronics.csv": None,
}


def _download(url: str, out: Path) -> None:
    if out.exists():
        print(f"[skip] {out.name} already present")
        return
    print(f"[fetch] {url} -> {out}")
    urllib.request.urlretrieve(url, out)


def download_wgi() -> None:
    dest = RAW / "wgi.zip"
    if SOURCES["wgi.csv"]:
        _download(SOURCES["wgi.csv"], dest)


def download_kaggle() -> None:
    """Requires kaggle CLI + KAGGLE_USERNAME/KAGGLE_KEY env vars."""
    if not (os.getenv("KAGGLE_USERNAME") and os.getenv("KAGGLE_KEY")):
        print("[skip] Kaggle credentials not set — skipping image dataset")
        return
    # Actual `kaggle datasets download` call added in commit 9
    print("[todo] Kaggle download hook — implemented in commit 9")


def main() -> int:
    print(f"Raw dir: {RAW}")
    download_wgi()
    download_kaggle()
    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
