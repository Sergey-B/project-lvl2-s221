import renderChanged from './changed';
import renderInserted from './inserted';
import renderDeleted from './deleted';

export default (type) => {
  if (type === 'inserted') {
    return renderInserted;
  }

  if (type === 'deleted') {
    return renderDeleted;
  }

  if (type === 'changed') {
    return renderChanged;
  }

  if (type === 'not changed' || type === 'nested') {
    return () => null;
  }

  return null;
};
