.PHONY: dev test unit style check test-cov

all:	clean check 

clean:
	rm -fr htmlcov .mypy_cache .pytest_cache .ruff_cache .coverage coverage.xml
	rm -rf build dist
	rm -rf __pycache__ 
	rm -rf */__pycache__ 
	rm -rf */*/__pycache__
	rm -rf */*/*/__pycache__
	rm -rf spark_warehouse

dev:
	pip install -e '.[dev]'

test:
	pip wheel . -w wheels
	mv ./wheels/databricks_pixels*.whl ./wheels/databricks_pixels.zip
	pytest -s tests  --import-mode=importlib -W ignore::DeprecationWarning

style:
	pre-commit run --all-files

check: style test

test-cov:
	test-cov-report && open htmlcov/index.html
