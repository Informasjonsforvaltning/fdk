import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const API_CATALOG_REQUEST = 'API_CATALOG_REQUEST';
export const API_CATALOG_SUCCESS = 'API_CATALOG_SUCCESS';
export const API_CATALOG_FAILURE = 'API_CATALOG_FAILURE';
export const API_CATALOG_INVALIDATE = 'API_CATALOG_INVALIDATE';

export function isApiCatalogHarvestPending(itemState) {
  return itemState && itemState.harvestSourceUri && !itemState.harvestStatus;
}

function shouldFetch(metaState, itemState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold) ||
    isApiCatalogHarvestPending(itemState)
  );
}

export function fetchApiCatalogIfNeededAction(catalogId) {
  return (dispatch, getState) =>
    shouldFetch(
      _.get(getState(), ['apiCatalog', catalogId, 'meta']),
      _.get(getState(), ['apiCatalog', catalogId, 'item'])
    ) &&
    dispatch(
      fetchActions(`/catalogs/${catalogId}/apicatalog`, [
        { type: API_CATALOG_REQUEST, meta: { catalogId } },
        { type: API_CATALOG_SUCCESS, meta: { catalogId } },
        { type: API_CATALOG_FAILURE, meta: { catalogId } }
      ])
    );
}

export const invalidateApiCatalogItemAction = catalogId => ({
  type: API_CATALOG_INVALIDATE,
  catalogId
});

const initialState = {};

export function apiCatalog(state = initialState, action) {
  switch (action.type) {
    case API_CATALOG_REQUEST:
      return {
        ...state,
        [action.meta.catalogId]: {
          meta: {
            isFetching: true,
            lastFetch: null
          }
        }
      };
    case API_CATALOG_SUCCESS:
      return {
        ...state,
        [action.meta.catalogId]: {
          item: action.payload,
          meta: {
            isFetching: false,
            lastFetch: Date.now()
          }
        }
      };
    case API_CATALOG_FAILURE:
      return {
        ...state,
        [action.meta.catalogId]: {
          meta: {
            isFetching: false,
            lastFetch: Date.now()
          }
        }
      };
    case API_CATALOG_INVALIDATE:
      return {
        ...state,
        [action.catalogId]: {
          meta: {
            isFetching: false,
            lastFetch: null
          }
        }
      };
    default:
      return state;
  }
}
