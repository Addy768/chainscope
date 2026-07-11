# Data — ChainScope

## Layout

- `raw/` — untouched downloads (gitignored)
- `processed/` — parquet/CSV outputs of `make_dataset.py` (gitignored)
- `download.py` — pulls each raw source into `raw/`
- `make_dataset.py` — deterministic pipeline `raw/` → `processed/`

## Sources

See [`../docs/DATA_CARD.md`](../docs/DATA_CARD.md) for the full data card,
licenses, and per-source known biases.

## Reproducibility

Both scripts are seeded (`SEED=42`) and version-pinned via `requirements.txt`.
Running `python data/download.py && python data/make_dataset.py` from a fresh
checkout should produce byte-identical `processed/` outputs.
