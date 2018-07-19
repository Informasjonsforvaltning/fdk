import { SETTINGS_PATCH } from '../ActionTypes';

const initialState = {
  language: 'nb'
};

export function settingsResolver(state = initialState, action) {
  switch (action.type) {
    case SETTINGS_PATCH:
      return { ...state, ...action.settings };
    default:
      return state;
  }
}
