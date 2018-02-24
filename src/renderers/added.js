export default (key, value) => {
  const valueString = typeof value === 'object' ? `complex value: ${JSON.stringify(value)}` : `value: ${value}`;
  return `Property ${key} was added with ${valueString}`;
};
