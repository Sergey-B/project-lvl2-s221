import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import gendiff from '../src';

const readFixturesFile = fileName => fs.readFileSync(path.join(__dirname, `./__fixtures__/${fileName}`), 'utf8');

test('diff flat json', () => {
  const firstConfigObject = JSON.parse(readFixturesFile('before.json'));
  const secondConfigObject = JSON.parse(readFixturesFile('after.json'));

  const expectedDiff = readFixturesFile('result.txt');

  expect(gendiff(firstConfigObject, secondConfigObject)).toEqual(expectedDiff);
});

test('diff flat yaml', () => {
  const firstConfigObject = yaml.safeLoad(readFixturesFile('before.yaml'));
  const secondConfigObject = yaml.safeLoad(readFixturesFile('after.yaml'));

  const expectedDiff = readFixturesFile('result.txt');

  expect(gendiff(firstConfigObject, secondConfigObject)).toEqual(expectedDiff);
});
