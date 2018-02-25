import path from 'path';
import fs from 'fs';
import gendiff from '../src';

const buildFilePath = fileName => path.join(__dirname, `./__fixtures__/${fileName}`);

describe('diff flat configs', () => {
  const expectedResult = fs.readFileSync(buildFilePath('flat/result.txt'), 'utf8');

  test('diff json files', () => {
    expect(gendiff(buildFilePath('flat/before.json'), buildFilePath('flat/after.json'))).toEqual(expectedResult);
  });

  test('diff yaml files', () => {
    expect(gendiff(buildFilePath('flat/before.yaml'), buildFilePath('flat/after.yaml'))).toEqual(expectedResult);
  });

  test('diff ini files', () => {
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
  const outputFormat = 'plain';

  test('diff json with plain output', () => {
    expect(gendiff(buildFilePath('nested/before.json'), buildFilePath('nested/after.json'), outputFormat)).toEqual(expectedResult);
  });

  test('diff yaml', () => {
    expect(gendiff(buildFilePath('nested/before.yaml'), buildFilePath('nested/after.yaml'), outputFormat)).toEqual(expectedResult);
  });

  test('diff ini', () => {
    expect(gendiff(buildFilePath('nested/before.ini'), buildFilePath('nested/after.ini'), outputFormat)).toEqual(expectedResult);
  });
});

describe('diff json output', () => {
  const expectedResult = fs.readFileSync(buildFilePath('nested/json_result.json'), 'utf8');
  const outputFormat = 'json';

  test('diff json', () => {
    expect(gendiff(buildFilePath('nested/before.json'), buildFilePath('nested/after.json'), outputFormat)).toEqual(expectedResult);
  });

  test('diff yaml', () => {
    expect(gendiff(buildFilePath('nested/before.yaml'), buildFilePath('nested/after.yaml'), outputFormat)).toEqual(expectedResult);
  });

  test('diff ini', () => {
    expect(gendiff(buildFilePath('nested/before.ini'), buildFilePath('nested/after.ini'), outputFormat)).toEqual(expectedResult);
  });
});
