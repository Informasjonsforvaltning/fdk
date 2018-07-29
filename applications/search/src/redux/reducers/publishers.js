import {
  PUBLISHERS_REQUEST,
  PUBLISHERS_SUCCESS,
  PUBLISHERS_FAILURE
} from '../ActionTypes';

export default function publishers(
  state = { isFetching: false, publisherItems: null },
  action
) {
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
