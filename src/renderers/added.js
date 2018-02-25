export default (node) => {
  const { name, value } = node;

  const valueString = typeof value === 'object' ? `complex value: ${JSON.stringify(value)}` : `value: ${value}`;
  return `Property ${name} was added with ${valueString}`;
};
