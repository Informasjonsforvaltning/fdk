import _ from 'lodash';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';
import { getReferenceData } from '../../api/referenceData';

export const REFERENCEEDATA_REQUEST = 'REFERENCEEDATA_REQUEST';
export const REFERENCEEDATA_SUCCESS = 'REFERENCEEDATA_SUCCESS';
export const REFERENCEEDATA_FAILURE = 'REFERENCEEDATA_FAILURE';

export const REFERENCEDATA_PATH_APISERVICETYPE = 'codes/apiservicetype';
export const REFERENCEDATA_PATH_APISTATUS = 'codes/apistatus';
export const REFERENCEDATA_PATH_DISTRIBUTIONTYPE = 'codes/distributiontype';
export const REFERENCEDATA_PATH_REFERENCETYPES = 'codes/referencetypes';
export const REFERENCEDATA_PATH_LOS = 'los';

export const REFERENCEEDATA_LOS_SUCCESS = 'REFERENCEEDATA_LOS_SUCCESS';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchReferenceDataIfNeededAction(path) {
  return (dispatch, getState) => {
    if (shouldFetch(_.get(getState(), ['referenceData', 'meta', path]))) {
      dispatch(
        reduxFsaThunk(() => getReferenceData(path), {
          onBeforeStart: { type: REFERENCEEDATA_REQUEST, meta: { path } },
          onSuccess: { type: REFERENCEEDATA_SUCCESS, meta: { path } },
          onError: { type: REFERENCEEDATA_FAILURE, meta: { path } }
        })
      );
    }
  };
}

export function fetchReferenceDataLosIfNeededAction() {
  return (dispatch, getState) => {
    if (
      shouldFetch(
        _.get(getState(), ['referenceData', 'meta', REFERENCEDATA_PATH_LOS])
      )
    ) {
      dispatch(
        reduxFsaThunk(() => getReferenceData(REFERENCEDATA_PATH_LOS), {
          onBeforeStart: { type: REFERENCEEDATA_REQUEST, meta: { path: REFERENCEDATA_PATH_LOS } },
          onSuccess: { type: REFERENCEEDATA_LOS_SUCCESS, meta: { path: REFERENCEDATA_PATH_LOS } },
          onError: { type: REFERENCEEDATA_FAILURE, meta: { path: REFERENCEDATA_PATH_LOS } }
        })
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
          [action.meta.path]: { isFetching: true, lastFetch: null }
        }
      };

    case REFERENCEEDATA_SUCCESS: {
      return {
        items: {
          ...state.items,
          [action.meta.path]: action.payload
        },
        meta: {
          ...state.meta,
          [action.meta.path]: { isFetching: false, lastFetch: Date.now() }
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
          [action.meta.path]: objFromArray
        },
        meta: {
          ...state.meta,
          [action.meta.path]: { isFetching: false, lastFetch: Date.now() }
        }
      };
    }
    case REFERENCEEDATA_FAILURE: {
      return {
        items: {
          ...state.items,
          [action.meta.path]: undefined
        },
        meta: {
          ...state.meta,
          [action.meta.path]: { isFetching: false, lastFetch: null }
        }
      };
    }
    default:
      return state;
  }
}

export const getReferenceDataByUri = (referenceData, path, uri) =>
  _.find(_.get(referenceData, ['items', path]), { uri });

export const getReferenceDataByCode = (referenceData, path, code) =>
  _.find(_.get(referenceData, ['items', path]), { code });
