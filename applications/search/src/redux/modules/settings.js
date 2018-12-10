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
    datasetSortValue: datasetSortValue
  };
}

const initialState = {
  language: 'nb',
  datasetSort:undefined
};

export function settingsResolver(state = initialState, action) {
  switch (action.type) {
    case SETTINGS_PATCH:
      return { ...state, ...action.settings };
    case SET_DATASET_SORT_PATCH:
      return { ...state, datasetSortValue: action.datasetSortValue };
    default:
      return state;
  }
}
