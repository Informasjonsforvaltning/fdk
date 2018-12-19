import _ from 'lodash';
import { fetchActions } from '../fetchActions';
import { addOrReplaceParamWithoutURL } from '../../lib/addOrReplaceUrlParam';

export const CONCEPTS_REQUEST = 'CONCEPTS_REQUEST';
export const CONCEPTS_SUCCESS = 'CONCEPTS_SUCCESS';
export const CONCEPTS_FAILURE = 'CONCEPTS_FAILURE';

function shouldFetch(metaState, query) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      ( (metaState.lastFetch || 0) < Date.now() - threshold || metaState.cachedQuery !== query))
  );
}

export function fetchConceptsIfNeededAction(query, aggregations = true) {
  const queryReplaced = addOrReplaceParamWithoutURL(query, 'aggregations', aggregations);
  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['concepts', 'meta']), queryReplaced) &&
    dispatch(
      fetchActions(`/api/concepts${queryReplaced}`, [
        { type: CONCEPTS_REQUEST, meta: { queryReplaced } },
        { type: CONCEPTS_SUCCESS, meta: { queryReplaced } },
        CONCEPTS_FAILURE,
      ])
    );
}

const initialState = {};

export function concepts(state = initialState, action) {
  switch (action.type) {
    case CONCEPTS_REQUEST:
      return {
        ...state,
          meta: {
            isFetching: true,
            lastFetch: null,
            cachedQuery: action.meta.query
          }
      };
    case CONCEPTS_SUCCESS:
      return {
        ...state,
          conceptTotal: _.get(action.payload, ['page', 'totalElements']),
          conceptItems: _.get(action.payload, ['_embedded', 'concepts']),
          conceptAggregations: _.get(action.payload, 'aggregations'),
          meta: {
            isFetching: false,
            lastFetch: Date.now(),
            cachedQuery: action.meta.query
          }
      };
    case CONCEPTS_FAILURE:
      return {
        ...state,
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
