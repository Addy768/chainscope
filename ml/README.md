# ML — ChainScope

## Layout

- `training/` — CLI training scripts (`train_classifier.py`, `train_detector.py`, `train_risk.py`)
- `artifacts/` — saved models (gitignored; regenerated via training scripts)
- `tests/` — regression tests that load each artifact and assert metrics

## Rebuild everything

```bash
python data/download.py
python data/make_dataset.py
python ml/training/train_classifier.py
python ml/training/train_detector.py
python ml/training/train_risk.py
pytest ml/tests/
```

Or (once added):

```bash
make train-all
```

## Model cards

See [`../docs/model_cards/`](../docs/model_cards/).
