# should be executed in the virtual environment (venv/bin/activate)
all:
	rm -rf dist
	broccoli build dist
