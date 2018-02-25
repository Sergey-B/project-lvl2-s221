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

const keyTypes = [
  {
    type: 'nested',
    check: (first, second, key) => (first[key] instanceof Object && second[key] instanceof Object)
    && !(first[key] instanceof Array && second[key] instanceof Array),
    process: (first, second, fun) => fun(first, second),
  },
  {
    type: 'not changed',
    check: (first, second, key) => (_.has(first, key) && _.has(second, key)
      && (first[key] === second[key])),
    process: first => _.identity(first),
  },
  {
    type: 'changed',
    check: (first, second, key) => (_.has(first, key) && _.has(second, key)
      && (first[key] !== second[key])),
    process: (first, second) => ({ old: first, new: second }),
  },
  {
    type: 'deleted',
    check: (first, second, key) => (_.has(first, key) && !_.has(second, key)),
    process: first => _.identity(first),
  },
  {
    type: 'inserted',
    check: (first, second, key) => (!_.has(first, key) && _.has(second, key)),
    process: (first, second) => _.identity(second),
  },
];

const buildDiffAst = (obj1, obj2) => {
  const firstObjKeys = _.keys(obj1);
  const secondObjKeys = _.keys(obj2);
  const commonKeys = _.union(firstObjKeys, secondObjKeys);

  return commonKeys.map((key) => {
    const { type, process } = _.find(keyTypes, item => item.check(obj1, obj2, key));
    const value = process(obj1[key], obj2[key], buildDiffAst);
    return { name: key, type, value };
  });
};

const aggregateNodesWithPath = (astTree) => {
  const iter = (acc, pathAcc, node) => {
    const {
      type, name, value,
    } = node;
    const newPathAcc = [...pathAcc, name];

    if (node.type === 'nested') {
      return [...acc, ...node.value.reduce((iAcc, n) => iter(iAcc, newPathAcc, n), [])];
    }

    const nodeWithPath = { type, name: newPathAcc.join('.'), value };
    return [...acc, nodeWithPath];
  };

  return astTree.reduce((iAcc, n) => iter(iAcc, [], n), []);
};

const buildPlainOutput = (astTree) => {
  const changedNodes = aggregateNodesWithPath(astTree).filter(node => node.type === 'inserted' || node.type === 'deleted' || node.type === 'changed');

  return changedNodes
    .map((node) => {
      const render = getRenderer(node.type);
      return render(node);
    })
    .join('\n')
    .concat('\n');
};

const buildSimpleOutput = (astTree) => {
  const iter = (acc, node) => {
    const { type, name, value } = node;
    const typeMapping = {
      inserted: '+', deleted: '-', 'not changed': ' ', nested: ' ',
    };
    const outputKey = `${typeMapping[type]} ${name}`;

    if (node.type === 'nested') {
      return { ...acc, [outputKey]: node.value.reduce(iter, {}) };
    }

    if (node.type === 'changed') {
      return { ...acc, [`+ ${name}`]: node.value.new, [`- ${name}`]: node.value.old };
    }

    return { ...acc, [outputKey]: value };
  };

  const outputObject = astTree.reduce(iter, []);
  const output = JSON.stringify(outputObject, null, 2)
    .replace(/"/g, '')
    .replace(/,/g, '');

  return output;
};

const buildJsonOutput = (astTree) => {
  const nodesWithPath = aggregateNodesWithPath(astTree);

  return JSON.stringify(nodesWithPath);
};

const buildOutput = (astTree, outputFormat = null) => {
  if (outputFormat === 'plain') {
    return buildPlainOutput(astTree);
  }

  if (outputFormat === 'json') {
    return buildJsonOutput(astTree);
  }

  return buildSimpleOutput(astTree);
};

const gendiff = (path1, path2, outputFormat = null) => {
  const { data: string1, format: format1 } = readConfig(path1);
  const { data: string2, format: format2 } = readConfig(path2);

  const configObject1 = parseConfig(string1, format1);
  const configObject2 = parseConfig(string2, format2);

  const diffAst = buildDiffAst(configObject1, configObject2);

  const output = buildOutput(diffAst, outputFormat);
  return output;
};

export default gendiff;
