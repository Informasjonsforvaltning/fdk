import { CALL_API } from '../middleware/api';
import * as actions from '../constants/ActionTypes';
import { addOrReplaceParamWithoutURL, addOrReplaceParam } from './../utils/addOrReplaceUrlParam';

function fetchApi(url, types) {
  return {
    [CALL_API]: {
      types,
      url
    }
  };
}

function shouldFetchApi(state) {
  return !state.isFetching;
}

export function fetchDatasetsIfNeeded(datasetsURL) {
  // add static size parameter
  datasetsURL = addOrReplaceParam(datasetsURL, 'size', '50');
  return (dispatch, getState) =>
    shouldFetchApi(
      getState().datasets) && dispatch(
      fetchApi(datasetsURL, [actions.DATASETS_REQUEST, actions.DATASETS_SUCCESS, actions.DATASETS_FAILURE])
    );
}

export function fetchTermsIfNeeded(termsURL) {
  // add static size parameter
  termsURL = addOrReplaceParam(termsURL, 'size', '50');
  return (dispatch, getState) =>
    shouldFetchApi(
      getState().terms) && dispatch(
      fetchApi(termsURL, [actions.TERMS_REQUEST, actions.TERMS_SUCCESS, actions.TERMS_FAILURE])
    );
}

export function fetchThemesIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(
      getState().themes) && dispatch(
      fetchApi('/reference-data/themes', [actions.THEMES_REQUEST, actions.THEMES_SUCCESS, actions.THEMES_FAILURE])
    );
}

export function publishDataset(value) {
  return dispatch =>
    dispatch({
      type: actions.PUBLISHDATASET,
      registrationStatus: value
    });
}

export function datasetLastSaved(value) {
  return dispatch =>
    dispatch({
      type: actions.DATASET_LAST_SAVED,
      lastSaved: value
    });
}

export function resetUser() {
  return dispatch =>
    dispatch({
      type: actions.USER_FAILURE
    });
}
