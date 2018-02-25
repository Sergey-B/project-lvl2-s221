import _ from 'lodash';

const renderChanged = (node) => {
  const { name, oldValue, newValue } = node;
  const [prevValue, currentValue] = [oldValue, newValue].map((v) => {
    const valueString = (typeof v) === 'object' ? JSON.stringify(v) : v;
    return valueString;
  });

  return `Property '${name}' was updated. From '${prevValue}' to '${currentValue}'`;
};

const valueString = value => (typeof value === 'object') ? `complex value: ${JSON.stringify(value)}` : `value: ${value}`;

const renderPlain = (ast) => {
  const iter = (acc, pathAcc, node) => {
    const {
      type, name, oldValue, newValue, children
    } = node;
    const fullPathAcc = [...pathAcc, name];
    const fullPath = fullPathAcc.join('.');

    if (node.type === 'nested') {
      return [...acc, ...node.children.reduce((iAcc, n) => iter(iAcc, fullPathAcc, n), [])];
    }

    if (node.type === 'changed') {
      const rendered = renderChanged({ type, name: fullPath, oldValue, newValue, children });
      return [...acc, rendered];
    }

    if (node.type === 'inserted') {
      const rendered = `Property ${fullPath} was added with ${valueString(newValue)}`
      return [...acc, rendered];
    }

    if (node.type === 'deleted') {
      const rendered = `Property '${fullPath}' was removed`;
      return [...acc, rendered];
    }

    return acc;
  };

  const output = ast.reduce((iAcc, n) => iter(iAcc, [], n), []);
  return _.compact(output);
};

export default (ast) => {
  const output = renderPlain(ast)
    .join('\n')
    .concat('\n');
  return output;
};
