import _ from 'lodash';
import {
  apiListAllPath,
  deleteApi
} from '../../services/api/registration-api/apis';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';
import { registrationApiGet } from '../../services/api/registration-api/host';

export const APIS_REQUEST = 'APIS_REQUEST';
export const APIS_SUCCESS = 'APIS_SUCCESS';
export const APIS_FAILURE = 'APIS_FAILURE';
export const APIS_ADD_ITEM = 'APIS_ADD_ITEM';
export const API_SUCCESS = 'API_SUCCESS';
export const API_DELETE = 'API_DELETE';

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
      !shouldFetch(_.get(getState(), ['apis', catalogId, 'meta']))
    ) {
      return;
    }

    dispatch(
      reduxFsaThunk(() => registrationApiGet(apiListAllPath(catalogId)), {
        onBeforeStart: { type: APIS_REQUEST, meta: { catalogId, force } },
        onSuccess: { type: APIS_SUCCESS, meta: { catalogId, force } },
        onError: { type: APIS_FAILURE, meta: { catalogId, force } }
      })
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

export const deleteApiAction = (catalogId, apiId) => ({
  type: API_DELETE,
  catalogId,
  apiId
});

export const deleteApiThunk = (catalogId, apiId) => async dispatch => {
  await deleteApi(catalogId, apiId);
  dispatch(deleteApiAction(catalogId, apiId));
};

const initialState = {};

export function apisReducer(state = initialState, action) {
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
          items: [],
          meta: {
            isFetching: false,
            lastFetch: Date.now()
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
      const isNew = !_.find(items, { id: action.payload.id });
      const newItems = isNew
        ? [...items, action.payload]
        : items.map(item =>
            item.id === action.payload.id ? action.payload : item
          );
      return {
        ...state,
        [action.payload.catalogId]: {
          items: newItems
        }
      };
    }
    case API_DELETE:
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

export const getAPIItemsCount = (apis, catalogId) =>
  _.get(apis, [catalogId, 'items'], []).length;
