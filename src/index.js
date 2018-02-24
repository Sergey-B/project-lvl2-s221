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

  const result = commonKeys.reduce((acc, key) => {
    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      const diff = { state: 'unchanged', key, children: buildDiffAst(obj1[key], obj2[key]) };
      return acc.concat(diff);
    }

    if (obj1[key] === obj2[key]) {
      const diff = { state: 'unchanged', key, value: obj1[key] };
      return acc.concat(diff);
    }

    if (obj1[key] && !obj2[key]) {
      const diff = { state: 'removed', key, value: obj1[key] };
      return acc.concat(diff);
    }

    if (!obj1[key] && obj2[key]) {
      const diff = { state: 'added', key, value: obj2[key] };
      return acc.concat(diff);
    }

    const diff = [
      { state: 'added', key, value: obj2[key] },
      { state: 'removed', key, value: obj1[key] },
    ];
    return acc.concat(diff);
  }, []);

  return result;
};

const renderPlainMessage = (nodes) => {
  if (nodes.length > 1) {
    const prevNodeState = nodes.find(n => n.state === 'removed');
    const currentNodeState = nodes.find(n => n.state === 'added');
    const { key, value: prevValue } = prevNodeState;
    const { value: currentValue } = currentNodeState;

    return getRenderer({ state: 'updated', key, value: [prevValue, currentValue] });
  }

  return getRenderer(nodes[0]);
};

const aggregateChangedNodes = (astTree) => {
  const iter = (acc, pathAcc, node) => {
    const {
      state, key, children, value,
    } = node;
    const newPathAcc = [...pathAcc, key];

    if (children) {
      return acc.concat(children.reduce((iAcc, n) => iter(iAcc, newPathAcc, n), []));
    }

    if (state === 'added' || state === 'removed') {
      const nodeWithPath = { state, key: newPathAcc.join('.'), value };
      return acc.concat([nodeWithPath]);
    }

    return acc;
  };

  return astTree.reduce((iAcc, n) => iter(iAcc, [], n), []);
};

const buildPlainOutput = (astTree) => {
  const changedNodes = aggregateChangedNodes(astTree);
  const changedKeys = _.uniq(changedNodes.map(node => node.key));

  return changedKeys
    .map(key => changedNodes.filter(node => node.key === key))
    .map(nodes => renderPlainMessage(nodes))
    .join('\n').concat('\n');
};

const buildJsonOutput = (astTree) => {
  const iter = (acc, node) => {
    const { state, key, value } = node;
    const stateMapping = { added: '+', removed: '-', unchanged: ' ' };
    const outputKey = `${stateMapping[state]} ${key}`;

    if (node.children) {
      return { ...acc, [outputKey]: node.children.reduce(iter, {}) };
    }

    return { ...acc, [outputKey]: value };
  };

  const outputObject = astTree.reduce(iter, []);
  const output = JSON.stringify(outputObject, null, 2)
    .replace(/"/g, '')
    .replace(/,/g, '');

  return output;
};

const buildOutput = (astTree, outputFormat = null) => {
  if (outputFormat === 'plain') {
    return buildPlainOutput(astTree);
  }

  return buildJsonOutput(astTree);
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
