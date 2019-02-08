import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const APIS_REQUEST = 'APIS_REQUEST';
export const APIS_SUCCESS = 'APIS_SUCCESS';
export const APIS_FAILURE = 'APIS_FAILURE';
export const APIS_ADD_ITEM = 'APIS_ADD_ITEM';
export const API_SUCCESS = 'API_SUCCESS';
export const APIS_ITEM_DELETE = 'APIS_ITEM_DELETE';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchApisIfNeededAction(catalogId, force) {
  return (dispatch, getState) => {
    if (
      !force &&
      !shouldFetch(
        _.get(getState(), ['apis', catalogId, 'meta']),
        _.get(getState(), ['apiCatalog', catalogId, 'item'])
      )
    ) {
      return;
    }

    dispatch(
      fetchActions(`/catalogs/${catalogId}/apis?size=1000`, [
        { type: APIS_REQUEST, meta: { catalogId, force } },
        { type: APIS_SUCCESS, meta: { catalogId, force } },
        { type: APIS_FAILURE, meta: { catalogId, force } }
      ])
    );
  };
}

export const addApiItemAction = payload => ({
  type: APIS_ADD_ITEM,
  payload
});

export const apiSuccessAction = payload => ({
  type: API_SUCCESS,
  payload
});

export const deleteApiItemAction = (catalogId, apiId) => ({
  type: APIS_ITEM_DELETE,
  catalogId,
  apiId
});

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
    case APIS_ADD_ITEM:
      return {
        ...state,
        [_.get(action.payload, 'catalogId')]: {
          items: [
            ..._.get(state, [_.get(action.payload, 'catalogId'), 'items'], []),
            action.payload
          ],
          meta: {
            ..._.get(state, [_.get(action.payload, 'catalogId'), 'meta'], [])
          }
        }
      };
    case API_SUCCESS: {
      const items = _.get(state, [action.payload.catalogId, 'items']);
      const isNew = !!_.find(items, { id: action.payload.id });
      const newItems = isNew
        ? [...items, action.payload]
        : items.map(
            item => (item.id === action.payload.id ? action.payload : item)
          );
      return {
        ...state,
        [action.payload.catalogId]: {
          items: newItems
        }
      };
    }
    case APIS_ITEM_DELETE:
      return {
        ...state,
        [action.catalogId]: {
          items: [
            _.get(state, [action.catalogId, 'items'], {}).map(item => {
              if (item.id !== action.apiId) {
                return item;
              }
              return null;
            })
          ]
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
