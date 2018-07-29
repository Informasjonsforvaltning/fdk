import { RSAA } from 'redux-api-middleware';

import * as actions from '../ActionTypes';
import { addOrReplaceParam } from '../../lib/addOrReplaceUrlParam';

function fetchApi(url, types) {
  return {
    [RSAA]: {
      endpoint: url,
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      types
    }
  };
}

function shouldFetchApi(state) {
  return !state.isFetching;
}

export function fetchDatasetsIfNeeded(datasetsURL) {
  // add static size parameter
  const url = addOrReplaceParam(datasetsURL, 'size', '50');
  return (dispatch, getState) =>
    shouldFetchApi(getState().datasets) &&
    dispatch(
      fetchApi(url, [
        actions.DATASETS_REQUEST,
        actions.DATASETS_SUCCESS,
        actions.DATASETS_FAILURE
      ])
    );
}

export function fetchDatasetDetailsIfNeeded(datasetURL) {
  return (dispatch, getState) =>
    shouldFetchApi(getState().datasetDetails) &&
    dispatch(
      fetchApi(datasetURL, [
        actions.DATASETDETAILS_REQUEST,
        actions.DATASETDETAILS_SUCCESS,
        actions.DATASETDETAILS_FAILURE
      ])
    );
}

export function fetchTermsIfNeeded(termsURL) {
  // add static size parameter
  const url = addOrReplaceParam(termsURL, 'size', '50');
  return (dispatch, getState) =>
    shouldFetchApi(getState().terms) &&
    dispatch(
      fetchApi(url, [
        actions.TERMS_REQUEST,
        actions.TERMS_SUCCESS,
        actions.TERMS_FAILURE
      ])
    );
}

export function fetchThemesIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(getState().themes) &&
    dispatch(
      fetchApi('/reference-data/themes', [
        actions.THEMES_REQUEST,
        actions.THEMES_SUCCESS,
        actions.THEMES_FAILURE
      ])
    );
}

export function fetchPublishersIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(getState().publishers) &&
    dispatch(
      fetchApi('/publisher', [
        actions.PUBLISHERS_REQUEST,
        actions.PUBLISHERS_SUCCESS,
        actions.PUBLISHERS_FAILURE
      ])
    );
}

export function fetchOpenLicensesIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(getState().openLicenses) &&
    dispatch(
      fetchApi('/reference-data/codes/openlicenses', [
        actions.OPENLICENSES_REQUEST,
        actions.OPENLICENSES_SUCCESS,
        actions.OPENLICENSES_FAILURE
      ])
    );
}

export function fetchDistributionTypeIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(getState().distributionTypes) &&
    dispatch(
      fetchApi('/reference-data/codes/distributiontype', [
        actions.DISTRIBUTIONTYPE_REQUEST,
        actions.DISTRIBUTIONTYPE_SUCCESS,
        actions.DISTRIBUTIONTYPE_FAILURE
      ])
    );
}

export function resetDatasetDetails() {
  return dispatch =>
    dispatch({
      type: actions.DATASETDETAILS_RESET
    });
}

export function setLanguage(language) {
  return {
    type: actions.SETTINGS_PATCH,
    settings: { language }
  };
}
