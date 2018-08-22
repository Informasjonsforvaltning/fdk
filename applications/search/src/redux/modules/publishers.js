import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const PUBLISHERS_REQUEST = 'PUBLISHERS_REQUEST';
export const PUBLISHERS_SUCCESS = 'PUBLISHERS_SUCCESS';
export const PUBLISHERS_FAILURE = 'PUBLISHERS_FAILURE';

function shouldFetch(state) {
  const threshold = 60 * 1000; // seconds
  return !state.isFetching && (state.lastFetch || 0) < Date.now() - threshold;
}

export function fetchPublishersIfNeededAction() {
  return (dispatch, getState) => {
    if (shouldFetch(getState().publishers)) {
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

const initialState = { isFetching: false, lastFetch: null, publisherItems: {} };

export function publishersReducer(state = initialState, action) {
  switch (action.type) {
    case PUBLISHERS_REQUEST: {
      return {
        ...state,
        isFetching: true,
        lastFetch: null
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
        isFetching: false,
        lastFetch: Date.now(),
        publisherItems: objFromArray
      };
    }
    case PUBLISHERS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        lastFetch: null,
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
