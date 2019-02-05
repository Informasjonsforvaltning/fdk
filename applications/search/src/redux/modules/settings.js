export const SETTINGS_PATCH = 'SETTINGS_PATCH';
export const SET_CONCEPT_SORT_PATCH = 'SET_CONCEPT_SORT_PATCH';
export const SET_INFORMATIONMODEL_SORT_PATCH =
  'SET_INFORMATIONMODEL_SORT_PATCH';

export function setLanguageAction(language) {
  return {
    type: SETTINGS_PATCH,
    settings: { language }
  };
}

export function setConceptSortAction(conceptSortValue) {
  return {
    type: SET_CONCEPT_SORT_PATCH,
    conceptSortValue
  };
}
export function setInformationModelSortAction(informationModelSortValue) {
  return {
    type: SET_INFORMATIONMODEL_SORT_PATCH,
    informationModelSortValue
  };
}

const initialState = {
  language: 'nb',
  conceptSortValue: undefined
};

export function settingsResolver(state = initialState, action) {
  switch (action.type) {
    case SETTINGS_PATCH:
      return { ...state, ...action.settings };
    case SET_CONCEPT_SORT_PATCH:
      return { ...state, conceptSortValue: action.conceptSortValue };
    case SET_INFORMATIONMODEL_SORT_PATCH:
      return {
        ...state,
        informationModelSortValue: action.informationModelSortValue
      };
    default:
      return state;
  }
}
