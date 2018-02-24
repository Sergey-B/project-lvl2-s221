import path from 'path';
import fs from 'fs';
import gendiff from '../src';

const buildFilePath = fileName => path.join(__dirname, `./__fixtures__/${fileName}`);

describe('diff flat configs', () => {
  const expectedResult = fs.readFileSync(buildFilePath('flat/result.txt'), 'utf8');

  test('diff json', () => {
    expect(gendiff(buildFilePath('flat/before.json'), buildFilePath('flat/after.json'))).toEqual(expectedResult);
  });

  test('diff yaml', () => {
    expect(gendiff(buildFilePath('flat/before.yaml'), buildFilePath('flat/after.yaml'))).toEqual(expectedResult);
  });

  test('diff ini', () => {
    expect(gendiff(buildFilePath('flat/before.ini'), buildFilePath('flat/after.ini'))).toEqual(expectedResult);
  });
});

describe('diff nested configs', () => {
  const expectedResult = fs.readFileSync(buildFilePath('nested/result.txt'), 'utf8');

  test('diff nested json', () => {
    expect(gendiff(buildFilePath('nested/before.json'), buildFilePath('nested/after.json'))).toEqual(expectedResult);
  });

  test('diff yaml', () => {
    expect(gendiff(buildFilePath('nested/before.yaml'), buildFilePath('nested/after.yaml'))).toEqual(expectedResult);
  });

  test('diff ini', () => {
    expect(gendiff(buildFilePath('nested/before.ini'), buildFilePath('nested/after.ini'))).toEqual(expectedResult);
  });
});

describe('diff plain output', () => {
  const expectedResult = fs.readFileSync(buildFilePath('nested/plain_result.txt'), 'utf8');

  test('diff json', () => {
    expect(gendiff(buildFilePath('nested/before.json'), buildFilePath('nested/after.json'), 'plain')).toEqual(expectedResult);
  });

  test('diff yaml', () => {
    expect(gendiff(buildFilePath('nested/before.yaml'), buildFilePath('nested/after.yaml'), 'plain')).toEqual(expectedResult);
  });

  test('diff ini', () => {
    expect(gendiff(buildFilePath('nested/before.ini'), buildFilePath('nested/after.ini'), 'plain')).toEqual(expectedResult);
  });
});
