# Contributing to ChainScope

Thanks for the interest — small PRs welcome.

## Ground rules

1. **One concern per PR.** If the title needs "and", split it.
2. **Conventional commits.** `feat(scope): subject` (see `COMMIT_PLAN.md`).
3. **Notebooks are prose.** No dead cells, no `TODO`s left in. Strip outputs
   before commit (pre-commit `nbstripout` does this).
4. **Models must have cards.** If you add a model, add
   `docs/model_cards/<name>.md` covering intended use, data, metrics,
   limitations.

## Dev setup

```bash
make install          # backend + frontend deps
pre-commit install    # ruff, nbstripout, prettier
make test             # pytest
```

## Reproducing model runs

```bash
make train-all
pytest ml/tests/      # will fail if metrics regress below thresholds
```

## Adding a new endpoint

1. New file under `backend/routes/`.
2. Register the blueprint in `backend/app.py`.
3. Add a smoke test in `backend/tests/`.
4. Add an entry to the API table in `README.md`.

## Reporting issues

Include: OS, Python + Node versions, command run, full error trace, and
which artifact (if any) was loaded when it failed.
