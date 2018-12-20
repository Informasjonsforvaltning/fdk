import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const PUBLISHERS_REQUEST = 'PUBLISHERS_REQUEST';
export const PUBLISHERS_SUCCESS = 'PUBLISHERS_SUCCESS';
export const PUBLISHERS_FAILURE = 'PUBLISHERS_FAILURE';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchPublishersIfNeededAction() {
  return (dispatch, getState) => {
    if (shouldFetch(_.get(getState(), ['publishers', 'meta']))) {
      dispatch(
        fetchActions('/publisher', [
          PUBLISHERS_REQUEST,
          PUBLISHERS_SUCCESS,
          PUBLISHERS_FAILURE
        ])
      );
    }
  };
}

const initialState = { meta: {}, publisherItems: {} };

export function publishersReducer(state = initialState, action) {
  switch (action.type) {
    case PUBLISHERS_REQUEST: {
      return {
        ...state,
        meta: {
          isFetching: true,
          lastFetch: null
        }
      };
    }
    case PUBLISHERS_SUCCESS: {
      const objFromArray = action.payload.hits.hits.reduce(
        (accumulator, current) => {
          accumulator[current._source.orgPath] = current._source;
          return accumulator;
        },
        {}
      );
      return {
        ...state,
        meta: {
          isFetching: false,
          lastFetch: Date.now()
        },
        publisherItems: objFromArray
      };
    }
    case PUBLISHERS_FAILURE: {
      return {
        ...state,
        meta: {
          isFetching: false,
          lastFetch: null
        },
        publisherItems: null
      };
    }
    default:
      return state;
  }
}

export const getPublisherByOrgNr = (publisherItems, id) => {
  if (publisherItems) {
    return _.find(publisherItems, ['id', id]);
  }
  return null;
};
