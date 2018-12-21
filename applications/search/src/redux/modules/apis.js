import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const APIS_REQUEST = 'APIS_REQUEST';
export const APIS_SUCCESS = 'APIS_SUCCESS';
export const APIS_FAILURE = 'APIS_FAILURE';

function shouldFetch(metaState, query) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      ((metaState.lastFetch || 0) < Date.now() - threshold ||
        metaState.cachedQuery !== query))
  );
}

export function fetchApisIfNeededAction(query) {
  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['apis', 'meta']), query) &&
    dispatch(
      fetchActions(`/api/apis/search?${query}`, [
        { type: APIS_REQUEST, meta: { query } },
        { type: APIS_SUCCESS, meta: { query } },
        APIS_FAILURE
      ])
    );
}

const initialState = {};

export function apis(state = initialState, action) {
  switch (action.type) {
    case APIS_REQUEST:
      return {
        ...state,
        meta: {
          isFetching: true,
          lastFetch: null,
          cachedQuery: action.meta.query
        }
      };
    case APIS_SUCCESS:
      return {
        ...state,
        apiItems: _.get(action.payload, 'hits'),
        apiAggregations: _.get(action.payload, 'aggregations'),
        apiTotal: _.get(action.payload, 'total'),
        meta: {
          isFetching: false,
          lastFetch: Date.now(),
          cachedQuery: action.meta.query
        }
      };
    case APIS_FAILURE:
      return {
        ...state,
        apiItems: null,
        apiAggregations: null,
        apiTotal: null,
        meta: {
          isFetching: false,
          lastFetch: null,
          cachedQuery: null
        }
      };
    default:
      return state;
  }
}
