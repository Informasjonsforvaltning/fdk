import { fetchActions } from '../redux/fetchActions';
import * as actions from '../constants/ActionTypes';

function shouldFetchApi(state) {
  return !state.isFetching;
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
