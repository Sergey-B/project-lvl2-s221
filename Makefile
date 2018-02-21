all: install

install:
	npm install

start:
	npm run babel-node -- src/bin/gendiff.js

build:
	rm -rf dist
	npm run build

publish:
	npm publish

build:
	rm -rf dist
	npm run build

test:
	npm test

lint:
	npm run eslint .
