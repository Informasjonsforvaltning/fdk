import { TOGGLE_INPUT_LANGUAGE } from './actionTypes';

export function toggleInputLanguage(language) {
  return {
    type: TOGGLE_INPUT_LANGUAGE,
    payload: {
      language
    }
  };
}
