import { PUBLISHERS_REQUEST, PUBLISHERS_SUCCESS, PUBLISHERS_FAILURE } from '../constants/ActionTypes';

export default function publishers(state = { isFetchingPublishers: false, publisherItems: null }, action) {
  switch (action.type) {
    case PUBLISHERS_REQUEST: {
      return {
        ...state,
        isFetchingPublishers: true
      };
    }
    case PUBLISHERS_SUCCESS: {
      const objFromArray = action.response.data.hits.hits.reduce((accumulator, current) => {
        accumulator[current._source.orgPath] = current._source
        return accumulator
      }, {});
      return {
        ...state,
        isFetchingPublishers: false,
        publisherItems: objFromArray // action.response.data.hits.hits // action.response.data
      }
    }
    case PUBLISHERS_FAILURE: {
      return {
        ...state,
        isFetchingPublishers: false,
        publisherItems: null
      };
    }
    default:
      return state;
  }
}
