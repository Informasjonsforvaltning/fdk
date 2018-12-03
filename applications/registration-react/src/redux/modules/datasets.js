import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const DATASETS_REQUEST = 'DATASETS_REQUEST';
export const DATASETS_SUCCESS = 'DATASETS_SUCCESS';
export const DATASETS_FAILURE = 'DATASETS_FAILURE';
export const DATASETS_ADD_ITEM = 'DATASETS_ADD_ITEM';
export const DATASETS_ITEM_SET_STATUS = 'DATASETS_ITEM_SET_STATUS';
export const DATASETS_ITEM_DELETE = 'DATASETS_ITEM_DELETE';

function shouldFetch(metaState) {
  const threshold = 60 * 100; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchDatasetsIfNeeded(catalogId) {
  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['datasets', catalogId, 'meta'])) &&
    dispatch(
      fetchActions(`/catalogs/${catalogId}/datasets?size=100`, [
        { type: DATASETS_REQUEST, meta: { catalogId } },
        { type: DATASETS_SUCCESS, meta: { catalogId } },
        { type: DATASETS_FAILURE, meta: { catalogId } }
      ])
    );
}

export const setDatasetItemStatusAction = (catalogId, datasetId, status) => ({
  type: DATASETS_ITEM_SET_STATUS,
  catalogId,
  datasetId,
  status
});

export const deleteDatasetItemAction = (catalogId, datasetId) => ({
  type: DATASETS_ITEM_DELETE,
  catalogId,
  datasetId
});

const initialState = {};

export default function datasets(state = initialState, action) {
  switch (action.type) {
    case DATASETS_REQUEST:
      return {
        ...state,
        [action.meta.catalogId]: {
          meta: {
            isFetching: true,
            lastFetch: null
          }
        }
      };
    case DATASETS_SUCCESS:
      return {
        ...state,
        [action.meta.catalogId]: {
          items: _.get(action.payload, ['_embedded', 'datasets']),
          meta: {
            isFetching: false,
            lastFetch: Date.now()
          }
        }
      };
    case DATASETS_FAILURE:
      return {
        ...state,
        [action.meta.catalogId]: {
          meta: {
            isFetching: false,
            lastFetch: null
          }
        }
      };
    case DATASETS_ITEM_SET_STATUS:
      return {
        ...state,
        [action.catalogId]: {
          items: [
            _.get(state, [action.catalogId, 'items'], {}).map(item => {
              if (item.id === action.datasetId) {
                return {
                  ...item,
                  registrationStatus: action.status
                };
              }
              return item;
            })
          ]
        }
      };
    case DATASETS_ITEM_DELETE:
      return {
        ...state,
        [action.catalogId]: {
          items: [
            _.get(state, [action.catalogId, 'items'], {}).map(item => {
              if (item.id !== action.datasetId) {
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

export const getDatasetItemsByCatalogId = (datasets, catalogId) =>
  _.get(datasets, [catalogId, 'items']);

export const getDatasetItemByDatasetiId = (datasets, catalogId, id) =>
  _.find(_.get(datasets, [catalogId, 'items'], []), ['id', id]);
