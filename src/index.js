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
      return [...acc, diff];
    }

    if (obj1[key] === obj2[key]) {
      const diff = { state: 'unchanged', key, value: obj1[key] };
      return [...acc, diff];
    }

    if (_.has(obj1, key) && !_.has(obj2, key)) {
      const diff = { state: 'removed', key, value: obj1[key] };
      return [...acc, diff];
    }

    if (!_.has(obj1, key) && _.has(obj2, key)) {
      const diff = { state: 'added', key, value: obj2[key] };
      return [...acc, diff];
    }

    const diff = [
      { state: 'added', key, value: obj2[key] },
      { state: 'removed', key, value: obj1[key] },
    ];
    return [...acc, ...diff];
  }, []);

  return result;
};

const aggregateNodesWithPath = (astTree) => {
  const iter = (acc, pathAcc, node) => {
    const {
      state, key, children, value,
    } = node;
    const newPathAcc = [...pathAcc, key];

    if (children) {
      return [...acc, ...children.reduce((iAcc, n) => iter(iAcc, newPathAcc, n), [])];
    }

    const nodeWithPath = { state, key: newPathAcc.join('.'), value };
    return [...acc, nodeWithPath];
  };

  return astTree.reduce((iAcc, n) => iter(iAcc, [], n), []);
};

const toAstWithUpdated = (astTree) => {
  const toNodeWithUpdated = (nodes) => {
    if (nodes.length > 1) {
      const prevNodeState = nodes.find(n => n.state === 'removed');
      const currentNodeState = nodes.find(n => n.state === 'added');
      const { key, value: prevValue } = prevNodeState;
      const { value: currentValue } = currentNodeState;

      return { state: 'updated', key, value: [prevValue, currentValue] };
    }

    return nodes[0];
  };

  const astTreeKeys = _.uniq(astTree.map(node => node.key));

  return astTreeKeys
    .map(key => astTree.filter(node => node.key === key))
    .map(nodes => toNodeWithUpdated(nodes));
};

const buildPlainOutput = (astTree) => {
  const changedNodes = aggregateNodesWithPath(astTree).filter(node => node.state === 'added' || node.state === 'removed');
  const nodesWithUpdated = toAstWithUpdated(changedNodes);

  return nodesWithUpdated
    .map(node => getRenderer(node))
    .join('\n')
    .concat('\n');
};

const buildSimpleOutput = (astTree) => {
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

const nodesToJsonOutput = (node) => {
  const { key } = node;
  const changesString = getRenderer(node);
  const changes = changesString ? [changesString] : [];

  return { key, changes };
};

const buildJsonOutput = (astTree) => {
  const nodesWithPath = aggregateNodesWithPath(astTree);
  const nodesWithUpdated = toAstWithUpdated(nodesWithPath);
  const outputObject = nodesWithUpdated.map(node => nodesToJsonOutput(node));

  return JSON.stringify(outputObject).concat('\n');
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
