import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const REFERENCEEDATA_REQUEST = 'REFERENCEEDATA_REQUEST';
export const REFERENCEEDATA_SUCCESS = 'REFERENCEEDATA_SUCCESS';
export const REFERENCEEDATA_FAILURE = 'REFERENCEEDATA_FAILURE';
export const REFERENCEDATA_PATH_APISTATUS = 'codes/apistatus';
export const REFERENCEDATA_PATH_APISERVICETYPE = 'codes/apiservicetype';
export const REFERENCEDATA_PATH_LOS = 'los';

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
        fetchActions(`/reference-data/${path}`, [
          { type: REFERENCEEDATA_REQUEST, meta: { path } },
          { type: REFERENCEEDATA_SUCCESS, meta: { path } },
          { type: REFERENCEEDATA_FAILURE, meta: { path } }
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
