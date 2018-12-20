import _ from 'lodash';
import { normalizeAggregations } from '../../lib/normalizeAggregations';
import { fetchActions } from '../fetchActions';

export const DATASETS_REQUEST = 'DATASETS_REQUEST';
export const DATASETS_SUCCESS = 'DATASETS_SUCCESS';
export const DATASETS_FAILURE = 'DATASETS_FAILURE';

function shouldFetch(metaState, query) {
  const threshold = 60 * 100; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      ((metaState.lastFetch || 0) < Date.now() - threshold ||
        metaState.cachedQuery !== query))
  );
}

export function fetchDatasetsIfNeededAction(query) {
  return (dispatch, getState) =>
    shouldFetch(
      _.get(getState(), ['datasets', encodeURIComponent(query), 'meta']),
      query
    ) &&
    dispatch(
      fetchActions(`/datasets?${query}`, [
        { type: DATASETS_REQUEST, meta: { query } },
        { type: DATASETS_SUCCESS, meta: { query } },
        { type: DATASETS_FAILURE, meta: { query } }
      ])
    );
}

const initialState = {};

export function datasets(state = initialState, action) {
  switch (action.type) {
    case DATASETS_REQUEST:
      return {
        ...state,
        [encodeURIComponent(action.meta.query)]: {
          meta: {
            isFetching: true,
            lastFetch: null,
            cachedQuery: null
          }
        }
      };
    case DATASETS_SUCCESS:
      return {
        ...state,
        [encodeURIComponent(action.meta.query)]: {
          datasetItems: _.get(action.payload, ['hits', 'hits']),
          datasetAggregations: _.get(normalizeAggregations(action.payload), [
            'aggregations'
          ]),
          datasetTotal: _.get(action.payload, ['hits', 'total']),
          meta: {
            isFetching: false,
            lastFetch: Date.now(),
            cachedQuery: action.meta.query
          }
        }
      };
    case DATASETS_FAILURE:
      return {
        ...state,
        [encodeURIComponent(action.meta.query)]: {
          meta: {
            isFetching: false,
            lastFetch: null,
            cachedQuery: null
          }
        }
      };
    default:
      return state;
  }
}

export const getDatasetItemByQueryKey = (datasets, key) =>
  _.get(datasets, key, []);
