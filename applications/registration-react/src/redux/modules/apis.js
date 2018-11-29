import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const APIS_REQUEST = 'APIS_REQUEST';
export const APIS_SUCCESS = 'APIS_SUCCESS';
export const APIS_FAILURE = 'APIS_FAILURE';
export const APIS_ADD_ITEM = 'APIS_ADD_ITEM';
export const APIS_ITEM_SET_STATUS = 'APIS_ITEM_SET_STATUS';

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
      fetchActions(`/catalogs/${catalogId}/apis?size=1000`, [
        { type: APIS_REQUEST, meta: { catalogId } },
        { type: APIS_SUCCESS, meta: { catalogId } },
        { type: APIS_FAILURE, meta: { catalogId } }
      ])
    );
}

export const addApiItemAction = payload => ({
  type: APIS_ADD_ITEM,
  payload
});

export const setApiItemStatusAction = (catalogId, apiId, status) => ({
  type: APIS_ITEM_SET_STATUS,
  catalogId,
  apiId,
  status
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
    case APIS_ITEM_SET_STATUS:
      return {
        ...state,
        [action.catalogId]: {
          items: [
            _.get(state, [action.catalogId, 'items'], {}).map(item => {
              if (item.id === action.apiId) {
                return {
                  ...item,
                  registrationStatus: 'DELETED'
                };
              }
              return item;
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
