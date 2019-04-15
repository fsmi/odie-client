# should be executed in the virtual environment (venv/bin/activate)
all:
	rm -rf dist
	node_modules/.bin/broccoli build dist
