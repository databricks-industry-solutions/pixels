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


style:
	pre-commit run --all-files

test:
	pytest -s tests  --import-mode=importlib -W ignore::DeprecationWarning

check: style test

test-cov:
	test-cov-report && open htmlcov/index.html
