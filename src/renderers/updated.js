export default (node) => {
  const { name, value } = node;
  const [prevValue, currentValue] = [value.old, value.new].map((v) => {
    const valueString = (typeof v) === 'object' ? JSON.stringify(v) : v;
    return valueString;
  });

  return `Property '${name}' was updated. From '${prevValue}' to '${currentValue}'`;
};
