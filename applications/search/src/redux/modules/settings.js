export const SETTINGS_PATCH = 'SETTINGS_PATCH';
export const SET_DATASET_SORT_PATCH = 'SET_DATASET_SORT_PATCH';
export const SET_API_SORT_PATCH = 'SET_API_SORT_PATCH';
export const SET_CONCEPT_SORT_PATCH = 'SET_CONCEPT_SORT_PATCH';

export function setLanguageAction(language) {
  return {
    type: SETTINGS_PATCH,
    settings: { language }
  };
}
export function setDatasetSortAction(datasetSortValue) {
  return {
    type: SET_DATASET_SORT_PATCH,
    datasetSortValue
  };
}
export function setApiSortAction(apiSortValue) {
  return {
    type: SET_API_SORT_PATCH,
    apiSortValue
  };
}
export function setConceptSortAction(conceptSortValue) {
  return {
    type: SET_CONCEPT_SORT_PATCH,
    conceptSortValue
  };
}

const initialState = {
  language: 'nb',
  datasetSortValue: undefined,
  apiSortValue: undefined,
  conceptSortValue: undefined
};

export function settingsResolver(state = initialState, action) {
  switch (action.type) {
    case SETTINGS_PATCH:
      return { ...state, ...action.settings };
    case SET_DATASET_SORT_PATCH:
      return { ...state, datasetSortValue: action.datasetSortValue };
    case SET_API_SORT_PATCH:
      return { ...state, apiSortValue: action.apiSortValue };
    case SET_CONCEPT_SORT_PATCH:
      return { ...state, conceptSortValue: action.conceptSortValue };
    default:
      return state;
  }
}
