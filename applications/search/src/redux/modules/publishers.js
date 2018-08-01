import { fetchActions } from '../fetchActions';

export const PUBLISHERS_REQUEST = 'PUBLISHERS_REQUEST';
export const PUBLISHERS_SUCCESS = 'PUBLISHERS_SUCCESS';
export const PUBLISHERS_FAILURE = 'PUBLISHERS_FAILURE';

export function fetchPublishersIfNeededAction() {
  return (dispatch, getState) => {
    if (!getState().publishers.isFetching) {
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

const initialState = { isFetching: false, publisherItems: {} };

export function publishersReducer(state = initialState, action) {
  switch (action.type) {
    case PUBLISHERS_REQUEST: {
      return {
        ...state,
        isFetching: true
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
        publisherItems: objFromArray
      };
    }
    case PUBLISHERS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        publisherItems: null
      };
    }
    default:
      return state;
  }
}
