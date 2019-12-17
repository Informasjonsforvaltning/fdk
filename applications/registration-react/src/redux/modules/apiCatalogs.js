import _ from 'lodash';
import { fetchApisIfNeededAction } from './apis';
import {
  getApiCatalog,
  postApiCatalog
} from '../../services/api/registration-api/apis';

export const API_CATALOG_REQUEST = 'API_CATALOG_REQUEST';
export const API_CATALOG_SUCCESS = 'API_CATALOG_SUCCESS';
export const API_CATALOG_FAILURE = 'API_CATALOG_FAILURE';

export function isApiCatalogHarvestPending(apiCatalog) {
  return apiCatalog && apiCatalog.harvestSourceUri && !apiCatalog.harvestStatus;
}

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds

  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

function retryWhileHarvestPending(apiCatalog, dispatch, catalogId) {
  const retryTimeout = 1000;
  if (isApiCatalogHarvestPending(apiCatalog)) {
    setTimeout(() => {
      dispatch(fetchApiCatalogIfNeededThunk(catalogId, true)); // eslint-disable-line no-use-before-define
      dispatch(fetchApisIfNeededAction(catalogId, true));
    }, retryTimeout);
  }
}

export function fetchApiCatalogIfNeededThunk(catalogId, force) {
  return async (dispatch, getState) => {
    // early exit if not forced and if cache is frece
    if (
      !force &&
      !shouldFetch(_.get(getState(), ['apiCatalog', catalogId, 'meta']))
    ) {
      return;
    }

    dispatch({ type: API_CATALOG_REQUEST, meta: { catalogId, force } });
    try {
      const apiCatalog = await getApiCatalog(catalogId);
      dispatch({
        type: API_CATALOG_SUCCESS,
        meta: { catalogId, force },
        payload: apiCatalog
      });
      retryWhileHarvestPending(apiCatalog, dispatch, catalogId);
    } catch (e) {
      dispatch({
        type: API_CATALOG_FAILURE,
        meta: { catalogId, force },
        payload: e
      });
    }
  };
}

export function postApiCatalogThunk(catalogId, data) {
  return async dispatch => {
    dispatch({ type: API_CATALOG_REQUEST, meta: { catalogId } });
    try {
      const apiCatalog = await postApiCatalog(catalogId, data);
      dispatch({
        type: API_CATALOG_SUCCESS,
        meta: { catalogId },
        payload: apiCatalog
      });
      retryWhileHarvestPending(apiCatalog, dispatch, catalogId);
    } catch (e) {
      dispatch({ type: API_CATALOG_FAILURE, meta: { catalogId }, payload: e });
    }
  };
}

const initialState = {};

export function apiCatalogReducer(state = initialState, action) {
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
