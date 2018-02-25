import _ from 'lodash';

const renderChanged = (node) => {
  const { name, oldValue, newValue } = node;
  const [prevValue, currentValue] = [oldValue, newValue].map((v) => {
    const output = (typeof v) === 'object' ? JSON.stringify(v) : v;
    return output;
  });

  return `Property '${name}' was updated. From '${prevValue}' to '${currentValue}'`;
};

const valueString = (value) => {
  const output = (typeof value === 'object') ? `complex value: ${JSON.stringify(value)}` : `value: ${value}`;
  return output;
};

const renderPlain = (ast) => {
  const iter = (acc, pathAcc, node) => {
    const {
      type, name, oldValue, newValue, children,
    } = node;
    const fullPathAcc = [...pathAcc, name];
    const fullPath = fullPathAcc.join('.');

    if (node.type === 'nested') {
      return [...acc, ...node.children.reduce((iAcc, n) => iter(iAcc, fullPathAcc, n), [])];
    }

    if (node.type === 'changed') {
      const rendered = renderChanged({
        type, name: fullPath, oldValue, newValue, children,
      });
      return [...acc, rendered];
    }

    if (node.type === 'inserted') {
      return [...acc, `Property ${fullPath} was added with ${valueString(newValue)}`];
    }

    if (node.type === 'deleted') {
      return [...acc, `Property '${fullPath}' was removed`];
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
