import { fetchActions } from '../fetchActions';

export const DATASETDETAILS_REQUEST = 'DATASETDETAILS_REQUEST';
export const DATASETDETAILS_SUCCESS = 'DATASETDETAILS_SUCCESS';
export const DATASETDETAILS_FAILURE = 'DATASETDETAILS_FAILURE';
export const DATASETDETAILS_RESET = 'DATASETDETAILS_RESET';

export function fetchDatasetDetailsIfNeededAction(datasetURL) {
  return (dispatch, getState) => {
    if (!getState().datasetDetails.isFetching) {
      dispatch(
        fetchActions(datasetURL, [
          DATASETDETAILS_REQUEST,
          DATASETDETAILS_SUCCESS,
          DATASETDETAILS_FAILURE
        ])
      );
    }
  };
}

export function resetDatasetDetailsAction() {
  return dispatch =>
    dispatch({
      type: DATASETDETAILS_RESET
    });
}

const initialState = {
  isFetching: false,
  datasetItem: null
};

export function datasetDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case DATASETDETAILS_REQUEST: {
      return {
        ...state,
        isFetching: true
      };
    }
    case DATASETDETAILS_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        datasetItem: action.payload.hits.hits[0]._source
      };
    }
    case DATASETDETAILS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        datasetItem: null
      };
    }
    case DATASETDETAILS_RESET: {
      return {
        ...state,
        isFetching: false,
        datasetItem: null
      };
    }
    default:
      return state;
  }
}
