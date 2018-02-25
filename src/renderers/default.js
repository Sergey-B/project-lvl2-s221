import _ from 'lodash';

const renderDefault = (ast, depth = 1) => {
  const indentWidth = 4;
  const indent = ' '.repeat(depth * indentWidth);

  const renderValue = (value, d = depth + 1) => {
    if (_.isObject(value)) {
      const iIndent = ' '.repeat(d * indentWidth);
      const body = _.keys(value).map(key => `${iIndent}${key}: ${renderValue(value[key])}`);
      return `{\n${body.join('\n')}\n${indent}}`;
    }

    return value;
  };

  const nodeToString = (node) => {
    const {
      type, name, oldValue, newValue, children,
    } = node;

    if (type === 'nested') {
      return `${indent}${name}: ${renderDefault(children, depth + 1)}`;
    }

    if (type === 'deleted') {
      return `${indent.slice(2)}- ${name}: ${renderValue(oldValue)}`;
    }

    if (type === 'changed') {
      return [`${indent.slice(2)}+ ${name}: ${renderValue(newValue)}`, `${indent.slice(2)}- ${name}: ${renderValue(oldValue)}`];
    }

    if (type === 'not changed') {
      return `${indent}${name}: ${renderValue(oldValue)}`;
    }

    if (type === 'inserted') {
      return `${indent.slice(2)}+ ${name}: ${renderValue(newValue)}`;
    }

    return null;
  };

  const outputObject = _.flatten(ast.reduce((acc, el) => [...acc, nodeToString(el)], []));
  return `{\n${outputObject.join('\n')}\n${indent.slice(indentWidth)}}`;
};

export default renderDefault;
