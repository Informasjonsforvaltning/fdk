import { FEATURES } from '../../app/features';

const initialState = {
  toggles: { [FEATURES.API]: false }
};

export function featureToggleResolver(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
