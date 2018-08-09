import _ from 'lodash';
import { addOrReplaceParam } from '../../lib/addOrReplaceUrlParam';
import { fetchActions } from '../fetchActions';

export const APIS_REQUEST = 'APIS_REQUEST';
export const APIS_SUCCESS = 'APIS_SUCCESS';
export const APIS_FAILURE = 'APIS_FAILURE';

export function fetchApisIfNeededAction(apisURL) {
  // add static size parameter
  const url = addOrReplaceParam(apisURL, 'size', '50');
  return (dispatch, getState) => {
    if (!getState().apis.isFetching) {
      dispatch(
        fetchActions(url, [APIS_REQUEST, APIS_SUCCESS, APIS_FAILURE])
      );
    }
  };
}

const initialState = {
  isFetching: false,
  apiItems: null
};

export function apisReducer(state = initialState, action) {
  switch (action.type) {
    case APIS_REQUEST: {
      return {
        ...state,
        isFetching: true
      };
    }
    case APIS_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        apiItems: action.payload
      };
    }
    case APIS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        apiItems: null
      };
    }
    default:
      return state;
  }
}
