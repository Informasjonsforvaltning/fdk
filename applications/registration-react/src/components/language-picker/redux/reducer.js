import { TOGGLE_INPUT_LANGUAGE } from './actionTypes';

import localization from '../../../lib/localization';

const initialState = {
  languages: [
    {
      code: 'nb',
      title: localization.lang.NO_NB,
      selected: true
    },
    {
      code: 'nn',
      title: localization.lang.NO_NN,
      selected: false
    },
    {
      code: 'en',
      title: localization.lang.ENG,
      selected: false
    }
  ]
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
