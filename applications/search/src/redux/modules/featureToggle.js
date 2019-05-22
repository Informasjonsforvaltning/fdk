import fp from 'lodash/fp';

export const FEATURES = {
  // API: 'API' //example
};

// featureToggle state gets rehydrated from localstore on init,
// initialState is the setting for the new and incognito users
const initialState = {
  toggles: {
    // [FEATURES.API]: true //example
  }
};

const filterCurrentToggles = fp.pick(Object.keys(FEATURES));

export function featureToggleResolver(state = initialState, action) {
  switch (action.type) {
    case 'STORE_INIT':
      // after rehydrating the store, keep only currently supported toggles
      return { toggles: filterCurrentToggles(state.toggles) };

    default:
      return state;
  }
}
