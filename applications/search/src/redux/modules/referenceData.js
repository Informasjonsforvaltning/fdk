import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const REFERENCEEDATA_REQUEST = 'REFERENCEEDATA_REQUEST';
export const REFERENCEEDATA_SUCCESS = 'REFERENCEEDATA_SUCCESS';
export const REFERENCEEDATA_FAILURE = 'REFERENCEEDATA_FAILURE';
export const REFERENCEDATA_DISTRIBUTIONTYPE = 'distributiontype';
export const REFERENCEDATA_REFERENCETYPES = 'referencetypes';
export const REFERENCEDATA_APISTATUS = 'apistatus';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchReferenceDataIfNeededAction(code) {
  return (dispatch, getState) => {
    if (shouldFetch(_.get(getState(), ['referenceData', 'meta', code]))) {
      dispatch(
        fetchActions(`/reference-data/codes/${code}`, [
          { type: REFERENCEEDATA_REQUEST, meta: { code } },
          { type: REFERENCEEDATA_SUCCESS, meta: { code } },
          { type: REFERENCEEDATA_FAILURE, meta: { code } }
        ])
      );
    }
  };
}

const initialState = {
  items: {},
  meta: {}
};

export function referenceDataReducer(state = initialState, action) {
  switch (action.type) {
    case REFERENCEEDATA_REQUEST:
      return {
        items: { ...state.items },
        meta: {
          ...state.meta,
          [action.meta.code]: { isFetching: true, lastFetch: null }
        }
      };

    case REFERENCEEDATA_SUCCESS: {
      return {
        items: {
          ...state.items,
          [action.meta.code]: action.payload
        },
        meta: {
          ...state.meta,
          [action.meta.code]: { isFetching: false, lastFetch: Date.now() }
        }
      };
    }
    case REFERENCEEDATA_FAILURE: {
      return {
        items: {
          ...state.items,
          [action.meta.code]: undefined
        },
        meta: {
          ...state.meta,
          [action.meta.code]: { isFetching: false, lastFetch: null }
        }
      };
    }
    default:
      return state;
  }
}

export const getReferenceDataByUri = (referenceData, code, uri) =>
  _.find(_.get(referenceData, ['items', code]), { uri });

export const getReferenceDataByCode = (referenceData, dataType, code) =>
  _.find(_.get(referenceData, ['items', dataType]), { code });
