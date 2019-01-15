import _ from 'lodash';
import { post, get } from 'axios';
import { fetchApisIfNeededAction } from './apis';

export const API_CATALOG_REQUEST = 'API_CATALOG_REQUEST';
export const API_CATALOG_SUCCESS = 'API_CATALOG_SUCCESS';
export const API_CATALOG_FAILURE = 'API_CATALOG_FAILURE';

export function isApiCatalogHarvestPending(itemState) {
  return itemState && itemState.harvestSourceUri && !itemState.harvestStatus;
}

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds

  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

function forceRetryIfPending(apiCatalog, dispatch, catalogId) {
  const retryTimeout = 1000;
  if (isApiCatalogHarvestPending(apiCatalog)) {
    setTimeout(() => {
      dispatch(fetchApiCatalogIfNeededAction(catalogId, true)); // eslint-disable-line no-use-before-define
      dispatch(fetchApisIfNeededAction(catalogId, true));
    }, retryTimeout);
  }
}

export function fetchApiCatalogIfNeededAction(catalogId, force) {
  const url = `/catalogs/${catalogId}/apicatalog`;

  return async (dispatch, getState) => {
    // early exit if not forced and if cache is frece
    if (
      !force &&
      !shouldFetch(
        _.get(getState(), ['apiCatalog', catalogId, 'meta']),
        _.get(getState(), ['apiCatalog', catalogId, 'item'])
      )
    ) {
      return;
    }

    dispatch({ type: API_CATALOG_REQUEST, meta: { catalogId, force } });
    try {
      const response = await get(url);
      const apiCatalog = response.data;
      dispatch({
        type: API_CATALOG_SUCCESS,
        meta: { catalogId, force },
        payload: apiCatalog
      });
      forceRetryIfPending(apiCatalog, dispatch, catalogId);
    } catch (e) {
      dispatch({
        type: API_CATALOG_FAILURE,
        meta: { catalogId, force },
        payload: e
      });
    }
  };
}

export function postApiCatalogAction(catalogId, data) {
  const url = `/catalogs/${catalogId}/apicatalog`;
  return async dispatch => {
    dispatch({ type: API_CATALOG_REQUEST, meta: { catalogId } });
    try {
      const response = await post(url, data);
      const apiCatalog = response.data;
      dispatch({
        type: API_CATALOG_SUCCESS,
        meta: { catalogId },
        payload: apiCatalog
      });
      forceRetryIfPending(apiCatalog, dispatch, catalogId);
    } catch (e) {
      dispatch({ type: API_CATALOG_FAILURE, meta: { catalogId }, payload: e });
    }
  };
}

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
            error: action.payload,
            isFetching: false,
            lastFetch: Date.now()
          }
        }
      };
    default:
      return state;
  }
}
