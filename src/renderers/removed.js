export default (node) => {
  const { key } = node;

  return `Property '${key}' was removed`;
};
