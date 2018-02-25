export default (node) => {
  const { key, value } = node;
  const [prevValue, currentValue] = value.map((v) => {
    const valueString = (typeof v) === 'object' ? JSON.stringify(v) : v;
    return valueString;
  });

  return `Property '${key}' was updated. From '${prevValue}' to '${currentValue}'`;
};
