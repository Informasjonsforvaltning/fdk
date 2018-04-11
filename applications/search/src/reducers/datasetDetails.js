import {
  DATASETDETAILS_REQUEST,
  DATASETDETAILS_SUCCESS,
  DATASETDETAILS_FAILURE,
  DATASETDETAILS_RESET
} from '../constants/ActionTypes';

export default function datasetDetails(
  state = {
    isFetchingDataset: false,
    datasetItem: null
  },
  action
) {
  switch (action.type) {
    case DATASETDETAILS_REQUEST: {
      return {
        ...state,
        isFetchingDataset: true
      };
    }
    case DATASETDETAILS_SUCCESS: {
      return {
        ...state,
        isFetchingDataset: false,
        datasetItem: action.response.data.hits.hits[0]._source
      };
    }
    case DATASETDETAILS_FAILURE: {
      return {
        ...state,
        isFetchingDataset: false,
        datasetItem: null
      };
    }
    case DATASETDETAILS_RESET: {
      return {
        ...state,
        isFetchingDataset: false,
        datasetItem: null
      };
    }
    default:
      return state;
  }
}
