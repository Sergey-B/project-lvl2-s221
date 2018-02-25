export default (node) => {
  const { name } = node;

  return `Property '${name}' was removed`;
};
