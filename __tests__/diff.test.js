import path from 'path';
import fs from 'fs';
import gendiff from '../src';

const buildFilePath = fileName => path.join(__dirname, `./__fixtures__/${fileName}`);
const expectedResult = fs.readFileSync(buildFilePath('result.txt'), 'utf8');

test('diff flat json', () => {
  expect(gendiff(buildFilePath('before.json'), buildFilePath('after.json'))).toEqual(expectedResult);
});

test('diff flat yaml', () => {
  expect(gendiff(buildFilePath('before.yaml'), buildFilePath('after.yaml'))).toEqual(expectedResult);
});

test('diff flat ini', () => {
  expect(gendiff(buildFilePath('before.ini'), buildFilePath('after.ini'))).toEqual(expectedResult);
});
