.PHONY: help install train-all serve test lint clean

help:
	@echo "Targets:"
	@echo "  make install      install backend + frontend deps"
	@echo "  make train-all    rebuild every model artifact end-to-end"
	@echo "  make serve        run backend + frontend concurrently (docker)"
	@echo "  make test         pytest backend + ml"
	@echo "  make lint         ruff check + eslint"
	@echo "  make clean        remove artifacts + caches"

install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install --no-audit --no-fund

train-all:
	python data/download.py
	python data/make_dataset.py
	python ml/training/train_classifier.py --epochs 8
	python ml/training/train_risk.py
	@echo "YOLOv8 detector: run notebooks/08_component_detection_yolov8.ipynb"

serve:
	docker compose up --build

test:
	cd backend && pytest -q
	pytest -q ml/tests/

lint:
	ruff check backend ml data
	cd frontend && npm run lint

clean:
	rm -rf ml/artifacts/*.pt ml/artifacts/*.pkl ml/artifacts/*.json
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type d -name .pytest_cache -exec rm -rf {} +
