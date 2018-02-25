import renderJson from './json';
import renderDefault from './default';
import renderPlain from './plain';

export default (format) => {
  if (format === 'json') {
    return renderJson;
  }

  if (format === 'plain') {
    return renderPlain;
  }

  return renderDefault;
};
