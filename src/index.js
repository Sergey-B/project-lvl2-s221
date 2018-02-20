import _ from 'lodash';

const gendiff = (firstConfig, secondConfig) => {
  const buildResultString = (diffObject) => {
    const body = _.entries(diffObject)
      .map(([k, v]) => `${k}: ${v}\n`)
      .join('  ');

    return `{\n  ${body}}\n`;
  };

  const diffObject = _.union(_.keys(firstConfig), _.keys(secondConfig))
    .reduce((acc, key) => {
      if (secondConfig[key] && !firstConfig[key]) {
        acc[`+ ${key}`] = secondConfig[key];
      } else if (firstConfig[key] && !secondConfig[key]) {
        acc[`- ${key}`] = firstConfig[key];
      } else if (secondConfig[key] !== firstConfig[key]) {
        acc[`+ ${key}`] = secondConfig[key];
        acc[`- ${key}`] = firstConfig[key];
      } else {
        acc[`  ${key}`] = (secondConfig[key] || firstConfig[key]);
      }

      return acc;
    }, {});

  return buildResultString(diffObject);
};

export default gendiff;
