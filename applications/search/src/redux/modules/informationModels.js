import _ from 'lodash';
import qs from 'qs';

import { informationmodelsSearchUrl } from '../../api/informationmodels';
import { fetchActions } from '../fetchActions';

export const INFORMATIONMODELS_REQUEST = 'INFORMATIONMODELS_REQUEST';
export const INFORMATIONMODELS_SUCCESS = 'INFORMATIONMODELS_SUCCESS';
export const INFORMATIONMODELS_FAILURE = 'INFORMATIONMODELS_FAILURE';

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

export function fetchInformationModelsIfNeededAction(query) {
  const queryKey = generateQueryKey(query);

  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['informationModels', 'meta']), queryKey) &&
    dispatch(
      fetchActions(informationmodelsSearchUrl(query), [
        { type: INFORMATIONMODELS_REQUEST, meta: { queryKey } },
        { type: INFORMATIONMODELS_SUCCESS, meta: { queryKey } },
        { type: INFORMATIONMODELS_FAILURE, meta: { queryKey } }
      ])
    );
}

const initialState = {};

export function informationModelsReducer(state = initialState, action) {
  switch (action.type) {
    case INFORMATIONMODELS_REQUEST:
      return {
        ...state,
        meta: {
          isFetching: true,
          lastFetch: null,
          queryKey: action.meta.queryKey
        }
      };
    case INFORMATIONMODELS_SUCCESS:
      return {
        ...state,
        informationModelItems: _.get(
          action.payload,
          '_embedded.informationmodels'
        ),
        informationModelAggregations: _.get(action.payload, 'aggregations'),
        informationModelTotal: _.get(action.payload, 'total'),
        meta: {
          isFetching: false,
          lastFetch: Date.now(),
          queryKey: action.meta.queryKey
        }
      };
    case INFORMATIONMODELS_FAILURE:
      return {
        ...state,
        informationModelItems: null,
        informationModelAggregations: null,
        informationModelTotal: null,
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
