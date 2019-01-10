import _ from 'lodash';
import { FEATURES } from '../../app/features';

const initialState = {
  toggles: {}
};

export function featureToggleResolver(state = initialState, action) {
  switch (action.type) {
    case 'STORE_INIT':
      return { toggles: _.pick(state.toggles, [FEATURES.INFORMATIONMODEL]) };

    default:
      return state;
  }
}
