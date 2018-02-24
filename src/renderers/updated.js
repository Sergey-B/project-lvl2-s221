export default (key, values) => {
  const [prevValue, currentValue] = values.map((v) => {
    const valueString = (typeof v) === 'object' ? JSON.stringify(v) : v;
    return valueString;
  });

  return `Property '${key}' was updated. From '${prevValue}' to '${currentValue}'`;
};
