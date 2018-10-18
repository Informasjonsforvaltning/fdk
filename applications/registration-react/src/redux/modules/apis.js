import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const APIS_REQUEST = 'APIS_REQUEST';
export const APIS_SUCCESS = 'APIS_SUCCESS';
export const APIS_FAILURE = 'APIS_FAILURE';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchApisIfNeededAction(catalogId) {
  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['apis', catalogId, 'meta'])) &&
    dispatch(
      fetchActions(`/catalogs/${catalogId}/apis`, [
        { type: APIS_REQUEST, meta: { catalogId } },
        { type: APIS_SUCCESS, meta: { catalogId } },
        { type: APIS_FAILURE, meta: { catalogId } }
      ])
    );
}

const initialState = {};

export default function apis(state = initialState, action) {
  switch (action.type) {
    case APIS_REQUEST:
      return {
        ...state,
        [action.meta.catalogId]: {
          meta: {
            isFetching: true,
            lastFetch: null
          }
        }
      };
    case APIS_SUCCESS:
      return {
        ...state,
        [action.meta.catalogId]: {
          items: _.get(action.payload, ['_embedded', 'apiRegistrations']),
          meta: {
            isFetching: false,
            lastFetch: Date.now()
          }
        }
      };
    case APIS_FAILURE:
      return {
        ...state,
        [action.meta.catalogId]: {
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

export const getApiItemsByCatalogId = (apis, catalogId) =>
  _.get(apis, [catalogId, 'items']);

export const getApiItemsByApiId = (apis, catalogId, id) =>
  _.find(_.get(apis, [catalogId, 'items'], []), ['id', id]);
