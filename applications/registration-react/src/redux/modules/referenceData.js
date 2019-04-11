import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const REFERENCEEDATA_REQUEST = 'REFERENCEEDATA_REQUEST';
export const REFERENCEEDATA_SUCCESS = 'REFERENCEEDATA_SUCCESS';
export const REFERENCEEDATA_FAILURE = 'REFERENCEEDATA_FAILURE';
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
    case REFERENCEEDATA_LOS_SUCCESS: {
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

export const getAllLosParentNodes = losItems =>
  _.filter(losItems, { parents: null });

export const getAllLosChildrenNodes = (losItems, children) =>
  _.filter(losItems, item => item.isTema && _.includes(children, item.uri));

export const getTopicsLosChildren = (losItems, children) =>
  _.filter(losItems, item => !item.isTema && _.includes(children, item.uri));

export const getLosReferences = (losItems, references, key) => {
  let items = [];
  if (references) {
    _.filter(losItems, item => {
      if (_.includes(references, item.uri)) {
        items = [...items, ...getLosReferences(losItems, item[key])];
        items.push(item);
      }
    });
  }
  return items;
};

export const getLosItemParentsAndChildren = (losItems, item) => {
  if (!item) {
    return losItems;
  }
  const parents = getLosReferences(losItems, _.get(item, 'parents'), 'parents');
  const children = getLosReferences(
    losItems,
    _.get(item, 'children'),
    'children'
  );
  return [item, ...parents, ...children];
};
