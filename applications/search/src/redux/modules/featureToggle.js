import _ from 'lodash';

const initialState = {
  toggles: {}
};

export function featureToggleResolver(state = initialState, action) {
  switch (action.type) {
    case 'STORE_INIT':
      return { toggles: _.pick(state.toggles, []) };

    default:
      return state;
  }
}
