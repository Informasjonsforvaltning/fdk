import _ from 'lodash';
import qs from 'qs';

import { normalizeAggregations } from '../../lib/normalizeAggregations';
import { fetchActions } from '../fetchActions';
import { datasetsSearchUrl } from '../../api/datasets';

export const DATASETS_REQUEST = 'DATASETS_REQUEST';
export const DATASETS_SUCCESS = 'DATASETS_SUCCESS';
export const DATASETS_FAILURE = 'DATASETS_FAILURE';

const generateQueryKey = query => qs.stringify(query, { skipNulls: true });

function shouldFetch(metaState, queryKey) {
  const threshold = 60 * 100; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      ((metaState.lastFetch || 0) < Date.now() - threshold ||
        metaState.queryKey !== queryKey))
  );
}

export function fetchDatasetsIfNeededAction(query) {
  const queryKey = generateQueryKey(query);
  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['datasets', 'meta']), queryKey) &&
    dispatch(
      fetchActions(datasetsSearchUrl(query), [
        { type: DATASETS_REQUEST, meta: { queryKey } },
        { type: DATASETS_SUCCESS, meta: { queryKey } },
        { type: DATASETS_FAILURE, meta: { queryKey } }
      ])
    );
}

const initialState = {};

export function datasetsReducer(state = initialState, action) {
  switch (action.type) {
    case DATASETS_REQUEST:
      return {
        ...state,
        meta: {
          isFetching: true,
          lastFetch: null,
          queryKey: action.meta.queryKey
        }
      };
    case DATASETS_SUCCESS:
      return {
        ...state,
        datasetItems: _.get(action.payload, ['hits', 'hits']),
        datasetAggregations: _.get(normalizeAggregations(action.payload), [
          'aggregations'
        ]),
        datasetTotal: _.get(action.payload, ['hits', 'total']),
        meta: {
          isFetching: false,
          lastFetch: Date.now(),
          queryKey: action.meta.queryKey
        }
      };
    case DATASETS_FAILURE:
      return {
        ...state,
        datasetItems: null,
        datasetAggregations: null,
        datasetTotal: null,
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
