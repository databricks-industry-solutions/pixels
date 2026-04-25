.PHONY: dev test unit style check test-cov

all:	clean dev check 

clean:
	rm -fr htmlcov .mypy_cache .pytest_cache .ruff_cache .coverage coverage.xml
	rm -rf build dist
	rm -rf __pycache__ 
	rm -rf */__pycache__ 
	rm -rf */*/__pycache__
	rm -rf */*/*/__pycache__
	rm -rf spark_warehouse

dev:
	python3 -m venv .venv  
	.venv/bin/pip install -r requirements.txt
	.venv/bin/pip install -e '.[dev]'

build:
	python3 -m build -w -o dist
	@if [ -d apps/dicom-web/ohif ] && [ "$$(ls apps/dicom-web/ohif/ | wc -l)" -gt 5 ]; then \
		tar czf dist/ohif.tar.gz -C apps/dicom-web ohif; \
		echo "Created dist/ohif.tar.gz ($$(du -sh dist/ohif.tar.gz | cut -f1))"; \
	fi
	@if [ -d models/vista3d ]; then \
		tar czf dist/vista3d.tar.gz --exclude='model' --exclude='assets' -C models vista3d; \
		echo "Created dist/vista3d.tar.gz ($$(du -sh dist/vista3d.tar.gz | cut -f1))"; \
	fi

test:
	.venv/bin/pip wheel . -w wheels
	mv ./wheels/databricks_pixels*.whl ./wheels/databricks_pixels.zip
	pytest -s tests  --import-mode=importlib -W ignore::DeprecationWarning

style:
	pre-commit run --all-files

check: style test

test-cov:
	test-cov-report && open htmlcov/index.html
