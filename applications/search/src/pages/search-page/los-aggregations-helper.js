import _ from 'lodash';

export const filterLosThemesFromAggregation = (list, losItems) => {
  if (!Array.isArray(list)) {
    return [];
  }
  return list.filter(item =>
    _.get(losItems, [item.key, 'isTema']) ? item : null
  );
};
