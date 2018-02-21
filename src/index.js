import _ from 'lodash';

const gendiff = (firstConfig, secondConfig) => {
  const diffObject = _.union(_.keys(firstConfig), _.keys(secondConfig))
    .reduce((acc, key) => {
      if (firstConfig[key] === secondConfig[key]) {
        return acc.concat([['unchanged', key, firstConfig[key]]]);
      }

      if (firstConfig[key] && !secondConfig[key]) {
        return acc.concat([['-', key, firstConfig[key]]]);
      }

      if (!firstConfig[key] && secondConfig[key]) {
        return acc.concat([['+', key, secondConfig[key]]]);
      }

      if (firstConfig[key] !== secondConfig[key]) {
        return acc.concat(
          [['+', key, secondConfig[key]]],
          [['-', key, firstConfig[key]]],
        );
      }

      return acc;
    }, []);

  return `{\n${
    diffObject
      .map(el => `  ${el[0] === 'unchanged' ? ' ' : el[0]} ${el[1]}: ${el[2]}`)
      .join('\n')
  }\n}\n`;
};

export default gendiff;
