/*
import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const APISTATUS_REQUEST = 'APISTATUS_REQUEST';
export const APISTATUS_SUCCESS = 'APISTATUS_SUCCESS';
export const APISTATUS_FAILURE = 'APISTATUS_FAILURE';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds

  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchApiStatusIfNeededAction() {
  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['apiStatus', 'meta'])) &&
    dispatch(
      fetchActions('/reference-data/codes/apistatus', [
        APISTATUS_REQUEST,
        APISTATUS_SUCCESS,
        APISTATUS_FAILURE
      ])
    );
}

const initialState = {};

export function apiStatus(state = initialState, action) {
  switch (action.type) {
    case APISTATUS_REQUEST: {
      return {
        ...state,
        meta: {
          isFetching: true,
          lastFetch: null
        }
      };
    }
    case APISTATUS_SUCCESS: {
      const apiStatusItems = action.payload.map(item => ({
        uri: item.uri,
        code: item.code,
        prefLabel_no: item.prefLabel.nb,
        prefLabel_nb: item.prefLabel.nb
      }));
      return {
        ...state,
        isFetchingApiStatus: false,
        apiStatusItems,
        meta: {
          isFetching: false,
          lastFetch: Date.now()
        }
      };
    }
    case APISTATUS_FAILURE: {
      return {
        ...state,
        isFetchingApiStatus: false,
        apiStatusItems: null,
        meta: {
          isFetching: false,
          lastFetch: null
        }
      };
    }
    default:
      return state;
  }
}
*/

import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const REFERENCEEDATA_REQUEST = 'REFERENCEEDATA_REQUEST';
export const REFERENCEEDATA_SUCCESS = 'REFERENCEEDATA_SUCCESS';
export const REFERENCEEDATA_FAILURE = 'REFERENCEEDATA_FAILURE';
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
      const items = action.payload.map(item => ({
        uri: item.uri,
        code: item.code,
        prefLabel_no: item.prefLabel.nb,
        prefLabel_nb: item.prefLabel.nb
      }));
      return {
        items: {
          ...state.items,
          [action.meta.code]: items
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
