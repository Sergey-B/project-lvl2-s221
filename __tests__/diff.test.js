import path from 'path';
import fs from 'fs';
import gendiff from '../src';

test('diff flat json', () => {
  const firstConfigPath = path.join(__dirname, './__fixtures__/before.json');
  const secondConfigPath = path.join(__dirname, './__fixtures__/after.json');

  const firstConfigObject = JSON.parse(fs.readFileSync(firstConfigPath));
  const secondConfigObject = JSON.parse(fs.readFileSync(secondConfigPath));

  const expectedDiff = fs.readFileSync(path.join(__dirname, './__fixtures__/result.txt'), 'utf8');

  expect(gendiff(firstConfigObject, secondConfigObject)).toEqual(expectedDiff);
});
