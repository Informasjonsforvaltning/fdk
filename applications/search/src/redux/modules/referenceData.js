import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const REFERENCEEDATA_REQUEST = 'REFERENCEEDATA_REQUEST';
export const REFERENCEEDATA_SUCCESS = 'REFERENCEEDATA_SUCCESS';
export const REFERENCEEDATA_FAILURE = 'REFERENCEEDATA_FAILURE';
export const REFERENCEDATA_DISTRIBUTIONTYPE = 'distributiontype';
export const REFERENCEDATA_REFERENCETYPES = 'referencetypes';
export const REFERENCEDATA_APISTATUS = 'apistatus';
export const REFERENCEDATA_APISERVICETYPE = 'apiservicetype';
export const REFERENCEDATA_LOS = 'los';
export const REFERENCEEDATA_LOS_SUCCESS = 'REFERENCEEDATA_LOS_SUCCESS';

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

export function fetchReferenceDataLosIfNeededAction() {
  return (dispatch, getState) => {
    if (
      shouldFetch(
        _.get(getState(), ['referenceData', 'meta', REFERENCEDATA_LOS])
      )
    ) {
      dispatch(
        fetchActions(`/reference-data/${REFERENCEDATA_LOS}`, [
          { type: REFERENCEEDATA_REQUEST, meta: { code: REFERENCEDATA_LOS } },
          {
            type: REFERENCEEDATA_LOS_SUCCESS,
            meta: { code: REFERENCEDATA_LOS }
          },
          { type: REFERENCEEDATA_FAILURE, meta: { code: REFERENCEDATA_LOS } }
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
    case REFERENCEEDATA_LOS_SUCCESS: {
      const objFromArray = action.payload.reduce((accumulator, current) => {
        accumulator[_.get(current, ['losPaths', 0], '').toLowerCase()] = {
          prefLabel: current.name,
          isTema: current.isTema,
          uri: current.uri
        };
        return accumulator;
      }, {});
      return {
        items: {
          ...state.items,
          [action.meta.code]: objFromArray
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
