all: clean lint fmt test

clean:
	rm -fr htmlcov .mypy_cache .pytest_cache .ruff_cache .coverage coverage.xml
	rm -rf build dist
	rm -rf __pycache__ 
	rm -rf */__pycache__ 
	rm -rf */*/__pycache__
	rm -rf */*/*/__pycache__

dev:
	pip install -e '.[test]'
	pip install pyspark==3.4.1

lint:
	hatch run lint:verify

fmt:
	hatch run lint:fmt

test:
	pytest -s tests  --import-mode=importlib -W ignore::DeprecationWarning
