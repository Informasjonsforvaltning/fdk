import {
  DATASETDETAILS_REQUEST,
  DATASETDETAILS_SUCCESS,
  DATASETDETAILS_FAILURE,
  DATASETDETAILS_RESET
} from '../ActionTypes';

export default function datasetDetails(
  state = {
    isFetching: false,
    datasetItem: null
  },
  action
) {
  switch (action.type) {
    case DATASETDETAILS_REQUEST: {
      return {
        ...state,
        isFetching: true
      };
    }
    case DATASETDETAILS_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        datasetItem: action.payload.hits.hits[0]._source
      };
    }
    case DATASETDETAILS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        datasetItem: null
      };
    }
    case DATASETDETAILS_RESET: {
      return {
        ...state,
        isFetching: false,
        datasetItem: null
      };
    }
    default:
      return state;
  }
}
