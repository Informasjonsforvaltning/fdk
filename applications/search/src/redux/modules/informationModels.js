import _ from 'lodash';

import {
  extractAggregations,
  extractInformationmodels,
  extractTotal,
  informationmodelsSearch
} from '../../api/informationmodels';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';

export const INFORMATIONMODELS_REQUEST = 'INFORMATIONMODELS_REQUEST';
export const INFORMATIONMODELS_SUCCESS = 'INFORMATIONMODELS_SUCCESS';
export const INFORMATIONMODELS_FAILURE = 'INFORMATIONMODELS_FAILURE';

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
  const queryKey = JSON.stringify(query);

  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['informationModels', 'meta']), queryKey) &&
    dispatch(
      reduxFsaThunk(
        () => informationmodelsSearch({ ...query, aggregations: 'true' }),
        {
          onBeforeStart: {
            type: INFORMATIONMODELS_REQUEST,
            meta: { queryKey }
          },
          onSuccess: { type: INFORMATIONMODELS_SUCCESS, meta: { queryKey } },
          onError: { type: INFORMATIONMODELS_FAILURE, meta: { queryKey } }
        }
      )
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
        informationModelItems: extractInformationmodels(action.payload),
        informationModelAggregations: extractAggregations(action.payload),
        informationModelTotal: extractTotal(action.payload),
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
