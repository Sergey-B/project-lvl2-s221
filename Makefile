all: install

install:
	npm install

start:
	npm run babel-node -- src/bin/gendiff.js

publish:
	npm publish

test:
	npm test

lint:
	npm run eslint .
