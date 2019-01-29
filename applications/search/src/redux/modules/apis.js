import _ from 'lodash';
import qs from 'qs';
import { fetchActions } from '../fetchActions';
import { apisSearchUrl } from '../../api/apis';

export const APIS_REQUEST = 'APIS_REQUEST';
export const APIS_SUCCESS = 'APIS_SUCCESS';
export const APIS_FAILURE = 'APIS_FAILURE';

const generateQueryKey = query => qs.stringify(query, { skipNulls: true });

function shouldFetch(metaState, queryKey) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      ((metaState.lastFetch || 0) < Date.now() - threshold ||
        metaState.queryKey !== queryKey))
  );
}

export function fetchApisIfNeededAction(query) {
  const queryKey = generateQueryKey(query);
  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['apis', 'meta']), queryKey) &&
    dispatch(
      fetchActions(apisSearchUrl(query), [
        { type: APIS_REQUEST, meta: { queryKey } },
        { type: APIS_SUCCESS, meta: { queryKey } },
        { type: APIS_FAILURE, meta: { queryKey } }
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
          queryKey: action.meta.queryKey
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
          queryKey: action.meta.queryKey
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
          lastFetch: null, // retry on error
          queryKey: action.meta.queryKey,
          error: action.payload
        }
      };
    default:
      return state;
  }
}
