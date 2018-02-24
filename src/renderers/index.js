import renderUpdated from './updated';
import renderAdded from './added';
import renderRemoved from './removed';

export default (node) => {
  const { state, key, value } = node;

  if (state === 'added') {
    return renderAdded(key, value);
  }

  if (state === 'removed') {
    return renderRemoved(key);
  }

  return renderUpdated(key, value);
};
