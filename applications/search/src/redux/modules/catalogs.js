import _ from 'lodash';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';
import { getAllCatalogs } from '../../api/catalogs';

export const CATALOGS_REQUEST = 'CATALOGS_REQUEST';
export const CATALOGS_SUCCESS = 'CATALOGS_SUCCESS';
export const CATALOGS_FAILURE = 'CATALOGS_FAILURE';

function shouldFetch(state) {
  const STALE_THRESHOLD = 60 * 1000; // Stale after 1 minute
  const isFresh = (state.lastFetch || 0) > Date.now() - STALE_THRESHOLD;
  return !state.isFetching && !isFresh;
}

export function fetchCatalogsIfNeededAction() {
  return (dispatch, getState) => {
    if (shouldFetch(getState().catalogs)) {
      dispatch(
        reduxFsaThunk(() => getAllCatalogs(), {
          onBeforeStart: { type: CATALOGS_REQUEST },
          onSuccess: { type: CATALOGS_SUCCESS },
          onError: { type: CATALOGS_FAILURE }
        })
      );
    }
  };
}

const initialState = { isFetching: false, lastFetch: null, items: {} };

export function catalogsReducer(state = initialState, action) {
  switch (action.type) {
    case CATALOGS_REQUEST: {
      return {
        ...state,
        isFetching: true,
        lastFetch: null
      };
    }
    case CATALOGS_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        lastFetch: Date.now(),
        items: _.keyBy(action.payload, 'uri')
      };
    }
    case CATALOGS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        lastFetch: null,
        items: null
      };
    }
    default:
      return state;
  }
}

export function getCatalogs(state) {
  return state.catalogs.items;
}
