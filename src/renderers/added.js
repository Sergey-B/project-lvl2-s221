export default (node) => {
  const { key, value } = node;

  const valueString = typeof value === 'object' ? `complex value: ${JSON.stringify(value)}` : `value: ${value}`;
  return `Property ${key} was added with ${valueString}`;
};
