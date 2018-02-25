import renderUpdated from './updated';
import renderAdded from './added';
import renderRemoved from './removed';

export default (node) => {
  const { state } = node;

  if (state === 'added') {
    return renderAdded(node);
  }

  if (state === 'removed') {
    return renderRemoved(node);
  }

  return renderUpdated(node);
};
