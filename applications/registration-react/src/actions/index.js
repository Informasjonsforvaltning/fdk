import { fetchActions } from '../redux/fetchActions';
import * as actions from '../constants/ActionTypes';

function shouldFetchApi(state) {
  return !state.isFetching;
}

export function fetchReferenceDatasetsIfNeeded(datasetURL) {
  return (dispatch, getState) =>
    shouldFetchApi(getState().referenceDatasets) &&
    dispatch(
      fetchActions(datasetURL, [
        actions.REFERENCEDATASETS_REQUEST,
        actions.REFERENCEDATASETS_SUCCESS,
        actions.REFERENCEDATASETS_FAILURE
      ])
    );
}

export function fetchProvenanceIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(getState().provenance) &&
    dispatch(
      fetchActions('/reference-data/codes/provenancestatement', [
        actions.PROVENANCE_REQUEST,
        actions.PROVENANCE_SUCCESS,
        actions.PROVENANCE_FAILURE
      ])
    );
}

export function fetchFrequencyIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(getState().frequency) &&
    dispatch(
      fetchActions('/reference-data/codes/frequency', [
        actions.FREQUENCY_REQUEST,
        actions.FREQUENCY_SUCCESS,
        actions.FREQUENCY_FAILURE
      ])
    );
}

export function fetchUserIfNeeded() {
  return (dispatch, getState) =>
    shouldFetchApi(getState().user) &&
    dispatch(
      fetchActions('/innloggetBruker', [
        actions.USER_REQUEST,
        actions.USER_SUCCESS,
        actions.USER_FAILURE
      ])
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
