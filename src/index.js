import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import getRenderer from './renderers';

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

const buildDiffAst = (obj1, obj2) => {
  const firstObjKeys = _.keys(obj1);
  const secondObjKeys = _.keys(obj2);
  const commonKeys = _.union(firstObjKeys, secondObjKeys);

  return commonKeys.reduce((acc, key) => {
    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      const diff = { type: 'nested', name: key, children: buildDiffAst(obj1[key], obj2[key]) };
      return [...acc, diff];
    }

    if (obj1[key] === obj2[key]) {
      const diff = { type: 'not changed', name: key, oldValue: obj1[key] };
      return [...acc, diff];
    }

    if (_.has(obj1, key) && !_.has(obj2, key)) {
      const diff = { type: 'deleted', name: key, oldValue: obj1[key] };
      return [...acc, diff];
    }

    if (!_.has(obj1, key) && _.has(obj2, key)) {
      const diff = { type: 'inserted', name: key, newValue: obj2[key] };
      return [...acc, diff];
    }

    return [...acc, {
      type: 'changed', name: key, newValue: obj2[key], oldValue: obj1[key],
    }];
  }, []);
};

const gendiff = (path1, path2, outputFormat = null) => {
  const { data: string1, format: format1 } = readConfig(path1);
  const { data: string2, format: format2 } = readConfig(path2);

  const configObject1 = parseConfig(string1, format1);
  const configObject2 = parseConfig(string2, format2);

  const ast = buildDiffAst(configObject1, configObject2);
  const renderOutput = getRenderer(outputFormat);
  return renderOutput(ast);
};

export default gendiff;
