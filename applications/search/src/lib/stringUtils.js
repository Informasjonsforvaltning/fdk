import _ from 'lodash';

export function removeValue(listAsString, value) {
  return _.without(listAsString.split(','), value).join(',') || undefined; // return undefined instead of empty
}

export function addValue(listAsString, value) {
  return (listAsString || '')
    .split(',')
    .concat(value)
    .filter(v => !!v)
    .join(',');
}
