.PHONY: all clean dev build test unit style check test-cov render-dashboard deploy

CATALOG ?= main
SCHEMA  ?= pixels
PROFILE ?= DEFAULT
TARGET  ?= prod

all:	clean dev check

clean:
	rm -fr htmlcov .mypy_cache .pytest_cache .ruff_cache .coverage coverage.xml
	rm -rf build dist
	rm -rf __pycache__ 
	rm -rf */__pycache__ 
	rm -rf */*/__pycache__
	rm -rf */*/*/__pycache__
	rm -rf spark_warehouse

PYTHON ?= $(shell command -v python3.12 2>/dev/null || command -v python3.11 2>/dev/null || command -v python3.10 2>/dev/null || echo python3)

dev:
	$(PYTHON) -m venv .venv
	.venv/bin/pip install --upgrade pip
	.venv/bin/pip install -r requirements.txt
	.venv/bin/pip install -e '.[dev]'

build:
	.venv/bin/python -m build -w -o dist
	@if [ -d apps/dicom-web/ohif ] && [ "$$(ls apps/dicom-web/ohif/ | wc -l)" -gt 5 ]; then \
		tar czf dist/ohif.tar.gz -C apps/dicom-web ohif; \
		echo "Created dist/ohif.tar.gz ($$(du -sh dist/ohif.tar.gz | cut -f1))"; \
	fi
	@if [ -d models/monai ]; then \
		tar czf dist/vista3d.tar.gz --exclude='model' --exclude='assets' \
			-s ',^monai/,vista3d/,' -s ',^monai$$,vista3d,' -C models monai; \
		echo "Created dist/vista3d.tar.gz ($$(du -sh dist/vista3d.tar.gz | cut -f1))"; \
	fi

test:
	.venv/bin/pip wheel . -w wheels
	mv ./wheels/databricks_pixels*.whl ./wheels/databricks_pixels.zip
	pytest -s tests  --import-mode=importlib -W ignore::DeprecationWarning

style:
	pre-commit run --all-files
	echo "All ok"

check: style test

test-cov:
	test-cov-report && open htmlcov/index.html

render-dashboard:
	.venv/bin/python scripts/render_dashboard.py \
		--profile $(PROFILE) --catalog $(CATALOG) --schema $(SCHEMA) \
		--src "ai-bi/Pixels Object Catalog dashboard.lvdash.json.tmpl" \
		--out "dist/Pixels Object Catalog dashboard.lvdash.json"

deploy: build render-dashboard
	databricks bundle deploy -t $(TARGET) -p $(PROFILE) --auto-approve \
		--var catalog=$(CATALOG) --var schema=$(SCHEMA)
