import _ from 'lodash';

export const isFilterActive = props => {
  if (_.get(props, 'orgPath')) {
    return true;
  }
  return false;
};
