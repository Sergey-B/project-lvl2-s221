import _ from 'lodash';
import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';

const readConfig = path => fs.readFileSync(path, 'utf8');

const parseFunction = (path) => {
  const [, extension] = path.split('.');

  const parseFunctions = {
    json: jsonString => JSON.parse(jsonString),
    yaml: yamlString => yaml.safeLoad(yamlString),
    ini: iniString => ini.decode(iniString),
  };

  return parseFunctions[extension];
};

const parseConfig = (string, parseFn) => parseFn(string);

const buildDiff = (obj1, obj2) => {
  const result = _.union(_.keys(obj1), _.keys(obj2)).reduce((acc, key) => {
    if (obj1[key] === obj2[key]) {
      const newAcc = acc.concat([`   ${key}: ${obj1[key]}`]);
      return newAcc;
    }

    if (obj1[key] && !obj2[key]) {
      const newAcc = acc.concat([`  - ${key}: ${obj1[key]}`]);
      return newAcc;
    }

    if (!obj1[key] && obj2[key]) {
      const newAcc = acc.concat([`  + ${key}: ${obj2[key]}`]);
      return newAcc;
    }

    if (obj1[key] !== obj2[key]) {
      const newAcc = acc.concat(
        [`  + ${key}: ${obj2[key]}`],
        [`  - ${key}: ${obj1[key]}`],
      );
      return newAcc;
    }

    return acc;
  }, []);

  return result;
};

const buildOutput = diffObject => `{\n ${diffObject.join('\n')}\n}\n`;

const gendiff = (path1, path2) => {
  const string1 = readConfig(path1);
  const string2 = readConfig(path2);

  const configObject1 = parseConfig(string1, parseFunction(path1));
  const configObject2 = parseConfig(string2, parseFunction(path2));

  const diffObject = buildDiff(configObject1, configObject2);

  const output = buildOutput(diffObject);
  return output;
};

export default gendiff;
