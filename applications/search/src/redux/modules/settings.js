export const SETTINGS_PATCH = 'SETTINGS_PATCH';

export function setLanguageAction(language) {
  return {
    type: SETTINGS_PATCH,
    settings: { language }
  };
}

const initialState = {
  language: 'nb'
};

export function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case SETTINGS_PATCH:
      return { ...state, ...action.settings };
    default:
      return state;
  }
}
