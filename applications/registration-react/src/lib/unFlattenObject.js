import set from 'lodash/set';

export const unFlattenObject = object => {
  const result = {};
  Object.keys(object).forEach(key => {
    set(result, key, object[key]);
  });
  return result;
};
