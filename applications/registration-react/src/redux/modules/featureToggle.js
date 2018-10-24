import { FEATURES } from '../../app-protected-route/features';

const initialState = {
  [FEATURES.API]: true
};

export function featureToggleReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
