import _ from 'lodash';
import qs from 'qs';
import {
  conceptsSearch,
  extractAggregations,
  extractConcepts,
  extractTotal
} from '../../api/concepts';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';

export const CONCEPTS_REQUEST = 'CONCEPTS_REQUEST';
export const CONCEPTS_SUCCESS = 'CONCEPTS_SUCCESS';
export const CONCEPTS_FAILURE = 'CONCEPTS_FAILURE';

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

export function fetchConceptsIfNeededAction(query) {
  const queryKey = generateQueryKey(query);
  const params = { ...query, aggregations: 'orgPath' };

  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['concepts', 'meta']), queryKey) &&
    dispatch(
      reduxFsaThunk(() => conceptsSearch(params), {
        onBeforeStart: { type: CONCEPTS_REQUEST, meta: { queryKey } },
        onSuccess: { type: CONCEPTS_SUCCESS, meta: { queryKey } },
        onError: { type: CONCEPTS_FAILURE, meta: { queryKey } }
      })
    );
}

const initialState = {};

export function conceptReducer(state = initialState, action) {
  switch (action.type) {
    case CONCEPTS_REQUEST:
      return {
        ...state,
        meta: {
          isFetching: true,
          lastFetch: null,
          queryKey: action.meta.queryKey
        }
      };
    case CONCEPTS_SUCCESS:
      return {
        ...state,
        conceptItems: extractConcepts(action.payload),
        conceptAggregations: extractAggregations(action.payload),
        conceptTotal: extractTotal(action.payload),
        meta: {
          isFetching: false,
          lastFetch: Date.now(),
          queryKey: action.meta.queryKey
        }
      };
    case CONCEPTS_FAILURE:
      return {
        ...state,
        conceptItems: null,
        conceptAggregations: null,
        conceptTotal: null,
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
