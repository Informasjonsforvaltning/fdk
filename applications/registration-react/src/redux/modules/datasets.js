import _ from 'lodash';
import {
  DATASETS_REQUEST,
  DATASETS_SUCCESS,
  DATASETS_FAILURE
} from '../../constants/ActionTypes';
import { fetchActions } from '../fetchActions';

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
    default:
      return state;
  }
}

export const getDatasetItemsByCatalogId = (datasets, catalogId) =>
  _.get(datasets, [catalogId, 'items']);

export const getDatasetItemByDatasetiId = (datasets, catalogId, id) =>
  _.find(_.get(datasets, [catalogId, 'items'], []), ['id', id]);
