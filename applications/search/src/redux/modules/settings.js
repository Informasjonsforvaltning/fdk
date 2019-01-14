export const SETTINGS_PATCH = 'SETTINGS_PATCH';
export const SET_DATASET_SORT_PATCH = 'SET_DATASET_SORT_PATCH';
export const SET_API_SORT_PATCH = 'SET_API_SORT_PATCH';
export const SET_CONCEPT_SORT_PATCH = 'SET_CONCEPT_SORT_PATCH';
export const SET_INFORMATIONMODEL_SORT_PATCH =
  'SET_INFORMATIONMODEL_SORT_PATCH';
export const SET_DATASET_HITS_PER_PAGE_PATCH =
  'SET_DATASET_HITS_PER_PAGE_PATCH';
export const SET_API_HITS_PER_PAGE_PATCH = 'SET_API_HITS_PER_PAGE_PATCH';
export const SET_CONCEPT_HITS_PER_PAGE_PATCH =
  'SET_CONCEPT_HITS_PER_PAGE_PATCH';

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
export function setDatasetHitsPerPageAction(datasetHitsPerPageValue) {
  return {
    type: SET_DATASET_HITS_PER_PAGE_PATCH,
    datasetHitsPerPageValue
  };
}
export function setApiHitsPerPageAction(apiHitsPerPageValue) {
  return {
    type: SET_API_HITS_PER_PAGE_PATCH,
    apiHitsPerPageValue
  };
}
export function setConceptHitsPerPageAction(conceptHitsPerPageValue) {
  return {
    type: SET_CONCEPT_HITS_PER_PAGE_PATCH,
    conceptHitsPerPageValue
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
export function setInformationModelSortAction(informationModelSortValue) {
  return {
    type: SET_INFORMATIONMODEL_SORT_PATCH,
    informationModelSortValue
  };
}

const initialState = {
  language: 'nb',
  datasetSortValue: undefined,
  apiSortValue: undefined,
  conceptSortValue: undefined,
  datasetHitsPerPageValue: undefined,
  apiHitsPerPageValue: undefined,
  conceptHitsPerPageValue: undefined
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
    case SET_INFORMATIONMODEL_SORT_PATCH:
      return {
        ...state,
        informationModelSortValue: action.informationModelSortValue
      };
    case SET_DATASET_HITS_PER_PAGE_PATCH:
      return {
        ...state,
        datasetHitsPerPageValue: action.datasetHitsPerPageValue
      };
    case SET_API_HITS_PER_PAGE_PATCH:
      return { ...state, apiHitsPerPageValue: action.apiHitsPerPageValue };
    case SET_CONCEPT_HITS_PER_PAGE_PATCH:
      return {
        ...state,
        conceptHitsPerPageValue: action.conceptHitsPerPageValue
      };
    default:
      return state;
  }
}
