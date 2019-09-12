import _ from 'lodash';
import qs from 'qs';

import {
  datasetsSearch,
  extractAggregations,
  extractDatasets,
  extractTotal
} from '../../api/datasets';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';

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
  const params = {
    ...query,
    aggregations: 'accessRights,theme,orgPath,provenance,spatial,los'
  };
  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['datasets', 'meta']), queryKey) &&
    dispatch(
      reduxFsaThunk(() => datasetsSearch(params), {
        onBeforeStart: { type: DATASETS_REQUEST, meta: { queryKey } },
        onSuccess: { type: DATASETS_SUCCESS, meta: { queryKey } },
        onError: { type: DATASETS_FAILURE, meta: { queryKey } }
      })
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
        datasetItems: extractDatasets(action.payload),
        datasetAggregations: extractAggregations(action.payload),
        datasetTotal: extractTotal(action.payload),
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
