import _ from 'lodash';
import qs from 'qs';
import {
  apisSearch,
  extractAggregations,
  extractApis,
  extractTotal
} from '../../api/apis';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';

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
  const params = { ...query, aggregations: 'formats,orgPath' };

  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['apis', 'meta']), queryKey) &&
    dispatch(
      reduxFsaThunk(() => apisSearch(params), {
        onBeforeStart: { type: APIS_REQUEST, meta: { queryKey } },
        onSuccess: { type: APIS_SUCCESS, meta: { queryKey } },
        onError: { type: APIS_FAILURE, meta: { queryKey } }
      })
    );
}

const initialState = {};

export function apisReducer(state = initialState, action) {
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
        apiItems: extractApis(action.payload),
        apiAggregations: extractAggregations(action.payload),
        apiTotal: extractTotal(action.payload),
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
