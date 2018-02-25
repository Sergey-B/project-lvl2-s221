import _ from 'lodash';

const renderChanged = (node) => {
  const { name, value } = node;
  const [prevValue, currentValue] = [value.old, value.new].map((v) => {
    const valueString = (typeof v) === 'object' ? JSON.stringify(v) : v;
    return valueString;
  });

  return `Property '${name}' was updated. From '${prevValue}' to '${currentValue}'`;
};

const renderDeleted = (node) => {
  const { name } = node;
  return `Property '${name}' was removed`;
};

const renderInserted = (node) => {
  const { name, value } = node;

  const valueString = typeof value === 'object' ? `complex value: ${JSON.stringify(value)}` : `value: ${value}`;
  return `Property ${name} was added with ${valueString}`;
};

const renderDefault = () => null;

const typeRenderers = [
  {
    type: 'nested',
    process: renderDefault,
  },
  {
    type: 'not changed',
    process: renderDefault,
  },
  {
    type: 'changed',
    process: renderChanged,
  },
  {
    type: 'deleted',
    process: renderDeleted,
  },
  {
    type: 'inserted',
    process: renderInserted,
  },
];

const renderPlain = (ast) => {
  const iter = (acc, pathAcc, node) => {
    const {
      type, name, value,
    } = node;
    const newPathAcc = [...pathAcc, name];

    if (node.type === 'nested') {
      return [...acc, ...node.value.reduce((iAcc, n) => iter(iAcc, newPathAcc, n), [])];
    }

    const { process } = _.find(typeRenderers, el => el.type === node.type);
    const rendered = process({ type, name: newPathAcc.join('.'), value });

    return [...acc, rendered];
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
