export default (astTree) => {
  const iter = (acc, node) => {
    const { type, name, value } = node;
    const typeMapping = {
      inserted: '+', deleted: '-', 'not changed': ' ', nested: ' ',
    };
    const outputKey = `${typeMapping[type]} ${name}`;

    if (node.type === 'nested') {
      return { ...acc, [outputKey]: node.value.reduce(iter, {}) };
    }

    if (node.type === 'changed') {
      return { ...acc, [`+ ${name}`]: node.value.new, [`- ${name}`]: node.value.old };
    }

    return { ...acc, [outputKey]: value };
  };

  const outputObject = astTree.reduce(iter, []);
  const output = JSON.stringify(outputObject, null, 2)
    .replace(/"/g, '')
    .replace(/,/g, '');

  return output;
};
