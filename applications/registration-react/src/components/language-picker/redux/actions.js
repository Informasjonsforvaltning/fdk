import { RESET_INPUT_LANGUAGES, TOGGLE_INPUT_LANGUAGE } from './actionTypes';

export function resetInputLanguages() {
  return {
    type: RESET_INPUT_LANGUAGES
  };
}

export function toggleInputLanguage(language) {
  return {
    type: TOGGLE_INPUT_LANGUAGE,
    payload: {
      language
    }
  };
}
