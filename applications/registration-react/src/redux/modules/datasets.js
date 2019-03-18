import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const DATASETS_REQUEST = 'DATASETS_REQUEST';
export const DATASETS_SUCCESS = 'DATASETS_SUCCESS';
export const DATASETS_FAILURE = 'DATASETS_FAILURE';
export const DATASETS_ITEM_SET_STATUS = 'DATASETS_ITEM_SET_STATUS';
export const DATASETS_ITEM_DELETE = 'DATASETS_ITEM_DELETE';
export const DATASET_SUCCESS = 'DATASET_SUCCESS';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
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

export const datasetSuccessAction = payload => ({
  type: DATASET_SUCCESS,
  payload
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
    case DATASETS_SUCCESS: {
      const objFromArray = _.get(action.payload, [
        '_embedded',
        'datasets'
      ]).reduce((accumulator, current) => {
        accumulator[current.id] = current; // eslint-disable-line no-param-reassign
        return accumulator;
      }, {});
      return {
        ...state,
        [action.meta.catalogId]: {
          items: objFromArray,
          meta: {
            isFetching: false,
            lastFetch: Date.now()
          }
        }
      };
    }
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
    case DATASET_SUCCESS: {
      const items = _.get(state, [action.payload.catalogId, 'items']);
      return {
        ...state,
        [action.payload.catalogId]: {
          items: {
            ...items,
            [action.payload.id]: action.payload
          }
        }
      };
    }
    case DATASETS_ITEM_SET_STATUS:
      return {
        ...state,
        [action.catalogId]: {
          items: {
            ..._.get(state, [action.catalogId, 'items']),
            [action.datasetId]: {
              ..._.get(state, [action.catalogId, 'items', action.datasetId]),
              registrationStatus: action.status
            }
          }
        }
      };
    case DATASETS_ITEM_DELETE:
      return {
        ...state,
        [action.catalogId]: {
          ..._.omit(state, [action.catalogId, 'items'], action.datasetId)
        }
      };
    default:
      return state;
  }
}

export const getDatasetItemsByCatalogId = (datasets, catalogId) =>
  Object.values(_.get(datasets, [catalogId, 'items'], {}));

export const getDatasetItemByDatasetiId = (datasets, catalogId, id) =>
  _.get(datasets, [catalogId, 'items', id]);

export const getDatasetItemsCount = datasets => Object.keys(datasets).length;
