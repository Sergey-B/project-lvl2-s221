import renderUpdated from './updated';
import renderAdded from './added';
import renderRemoved from './removed';

export default (node) => {
  const { type } = node;

  if (type === 'inserted') {
    return renderAdded(node);
  }

  if (type === 'deleted') {
    return renderRemoved(node);
  }

  if (type === 'changed') {
    return renderUpdated(node);
  }

  return null;
};
