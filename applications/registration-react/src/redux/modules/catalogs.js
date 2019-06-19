import _ from 'lodash';
import {
  CATALOGS_REQUEST,
  CATALOGS_SUCCESS,
  CATALOGS_FAILURE
} from '../../constants/ActionTypes';
import { fetchActions } from '../fetchActions';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchCatalogsIfNeeded() {
  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), 'catalogs')) &&
    dispatch(
      fetchActions('/catalogs', [
        CATALOGS_REQUEST,
        CATALOGS_SUCCESS,
        CATALOGS_FAILURE
      ])
    );
}

const initialState = { isFetchingCatalogs: false, catalogItems: null };

export default function catalogs(state = initialState, action) {
  switch (action.type) {
    case CATALOGS_REQUEST:
      return {
        ...state,
        isFetching: true,
        lastFetch: null
      };
    case CATALOGS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        lastFetch: Date.now(),
        catalogItems: _.get(action.payload, ['_embedded', 'catalogs'])
      };
    case CATALOGS_FAILURE:
      return {
        ...state,
        isFetching: false,
        lastFetch: null,
        catalogItems: null
      };
    default:
      return state;
  }
}

export const getCatalogItemByCatalogId = (catalogItems, catalogId) => {
  if (Array.isArray(_.get(catalogItems, ['_embedded', 'catalogs']))) {
    return _.get(catalogItems, ['_embedded', 'catalogs']).filter(
      item => item.id === catalogId
    )[0];
  }
  return null;
};
