import { RESET_INPUT_LANGUAGES, TOGGLE_INPUT_LANGUAGE } from './actionTypes';

import localization from '../../../lib/localization';

const NB = 'nb';
const NN = 'nn';
const EN = 'en';

const initialState = {
  languages: [
    {
      code: NB,
      title: localization.lang.NO_NB,
      selected: true
    },
    {
      code: NN,
      title: localization.lang.NO_NN,
      selected: false
    },
    {
      code: EN,
      title: localization.lang.ENG,
      selected: false
    }
  ]
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RESET_INPUT_LANGUAGES: {
      return {
        ...state,
        languages: state.languages.map(({ code, title }) => ({
          code,
          title,
          selected: code === NB
        }))
      };
    }
    case TOGGLE_INPUT_LANGUAGE: {
      return {
        ...state,
        languages: state.languages.map(({ code, title, selected }) => ({
          code,
          title,
          selected: code === action.payload.language ? !selected : selected
        }))
      };
    }
    default: {
      return state;
    }
  }
}
