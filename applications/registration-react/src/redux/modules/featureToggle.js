import { FEATURES } from '../../app-protected-route/features';

const initialState = {
  [FEATURES.API]: false
};

export function featureToggleReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
