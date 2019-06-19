import _ from 'lodash';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';
import { referenceDataApi } from '../../api/reference-data-api';

const REFERENCEDATA_REQUEST = 'REFERENCEDATA_REQUEST';
const REFERENCEDATA_SUCCESS = 'REFERENCEDATA_SUCCESS';
const REFERENCEDATA_FAILURE = 'REFERENCEDATA_FAILURE';

export const REFERENCEDATA_PATH_APISERVICETYPE = 'codes/apiservicetype';
export const REFERENCEDATA_PATH_APISTATUS = 'codes/apistatus';
export const REFERENCEDATA_PATH_FREQUENCY = 'codes/frequency';
export const REFERENCEDATA_PATH_OPENLICENCES = 'codes/openlicenses';
export const REFERENCEDATA_PATH_PROVENANCE = 'codes/provenancestatement';
export const REFERENCEDATA_PATH_REFERENCETYPES = 'codes/referencetypes';
export const REFERENCEDATA_PATH_LOS = 'los';
export const REFERENCEDATA_PATH_THEMES = 'themes';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export const fetchReferenceDataIfNeededAction = path => (dispatch, getState) =>
  shouldFetch(_.get(getState(), ['referenceData', 'meta', path])) &&
  dispatch(
    reduxFsaThunk(() => referenceDataApi.get(path), {
      onBeforeStart: { type: REFERENCEDATA_REQUEST, meta: { path } },
      onSuccess: { type: REFERENCEDATA_SUCCESS, meta: { path } },
      onError: { type: REFERENCEDATA_FAILURE, meta: { path } }
    })
  );

const initialState = {
  items: {},
  meta: {}
};

export function referenceDataReducer(state = initialState, action) {
  switch (action.type) {
    case REFERENCEDATA_REQUEST:
      return {
        items: { ...state.items },
        meta: {
          ...state.meta,
          [action.meta.path]: { isFetching: true, lastFetch: null }
        }
      };

    case REFERENCEDATA_SUCCESS: {
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
    case REFERENCEDATA_FAILURE: {
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
