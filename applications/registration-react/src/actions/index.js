import { CALL_API } from '../middleware/api';
import * as actions from '../constants/ActionTypes';
//import * as routing from '../constants/Routing';

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

export function fetchDatasetIfNeeded(datasetURL) {
  return (dispatch, getState) =>
  shouldFetchApi(
    getState().dataset) && dispatch(
    fetchApi('/catalogs/910244132//datasets/e679b150-e69d-444c-bf7f-874d6999c62d', [actions.DATASET_REQUEST, actions.DATASET_SUCCESS, actions.DATASET_FAILURE])
  );
}

export function fetchHelptextsIfNeeded() {
  return (dispatch, getState) =>
  shouldFetchApi(
    getState().helptexts) && dispatch(
    fetchApi('/reference-data/helptexts', [actions.HELPTEXTS_REQUEST, actions.HELPTEXTS_SUCCESS, actions.HELPTEXTS_FAILURE])
  );
}

/*
export function showPublishmode(value) {
  return dispatch =>
    dispatch({
      type: actions.PUBLISHMODE,
      publishmodeVisible: value
    });
}
*/

