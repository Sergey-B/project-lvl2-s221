import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const readConfig = (filePath) => {
  const configString = fs.readFileSync(filePath, 'utf8');
  const configFormat = path.extname(filePath);

  return { data: configString, format: configFormat };
};

const parseConfig = (string, format) => {
  const parseFunctions = {
    '.json': JSON.parse,
    '.yaml': yaml.safeLoad,
    '.ini': ini.decode,
  };
  const parseFn = parseFunctions[format];

  return parseFn(string);
};

const buildDiff = (obj1, obj2) => {
  const firstObjKeys = _.keys(obj1);
  const secondObjKeys = _.keys(obj2);
  const commonKeys = _.union(firstObjKeys, secondObjKeys);

  const result = commonKeys.reduce((acc, key) => {
    if (obj1[key] === obj2[key]) {
      const diff = `   ${key}: ${obj1[key]}`;
      return acc.concat(diff);
    }

    if (obj1[key] && !obj2[key]) {
      const diff = `  - ${key}: ${obj1[key]}`;
      return acc.concat(diff);
    }

    if (!obj1[key] && obj2[key]) {
      const diff = `  + ${key}: ${obj2[key]}`;
      return acc.concat(diff);
    }

    if (obj1[key] !== obj2[key]) {
      const diff = [`  + ${key}: ${obj2[key]}`, `  - ${key}: ${obj1[key]}`];
      return acc.concat(diff);
    }

    return acc;
  }, []);

  return result;
};

const buildOutput = diffObject => `{\n ${diffObject.join('\n')}\n}\n`;

const gendiff = (path1, path2) => {
  const { data: string1, format: format1 } = readConfig(path1);
  const { data: string2, format: format2 } = readConfig(path2);

  const configObject1 = parseConfig(string1, format1);
  const configObject2 = parseConfig(string2, format2);

  const diffObject = buildDiff(configObject1, configObject2);

  const output = buildOutput(diffObject);
  return output;
};

export default gendiff;
