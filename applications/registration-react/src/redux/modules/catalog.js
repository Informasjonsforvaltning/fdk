import _ from 'lodash';
import { fetchActions } from '../fetchActions';

const CATALOG_REQUEST = 'CATALOG_REQUEST';
export const CATALOG_SUCCESS = 'CATALOG_SUCCESS';
const CATALOG_FAILURE = 'CATALOG_FAILURE';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchCatalogIfNeeded(catalogId) {
  return (dispatch, getState) => {
    if (shouldFetch(_.get(getState(), ['catalog', 'meta', catalogId]))) {
      dispatch(
        fetchActions(`/catalogs/${catalogId}`, [
          { type: CATALOG_REQUEST, meta: { catalogId } },
          { type: CATALOG_SUCCESS, meta: { catalogId } },
          { type: CATALOG_FAILURE, meta: { catalogId } }
        ])
      );
    }
  };
}

const initialState = {};

export default function catalog(state = initialState, action) {
  switch (action.type) {
    case CATALOG_REQUEST:
      return {
        ...state,
        meta: {
          [action.meta.catalogId]: {
            isFetching: true,
            lastFetch: null
          }
        }
      };
    case CATALOG_SUCCESS:
      return {
        ...state,
        items: {
          [action.meta.catalogId]: action.payload
        },
        meta: {
          [action.meta.catalogId]: {
            isFetching: true,
            lastFetch: null
          }
        }
      };
    case CATALOG_FAILURE:
      return {
        ...state,
        meta: {
          [action.meta.catalogId]: {
            isFetching: true,
            lastFetch: null
          }
        }
      };
    default:
      return state;
  }
}
