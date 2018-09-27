import {
  DATASETS_REQUEST,
  DATASETS_SUCCESS,
  DATASETS_FAILURE
} from '../../constants/ActionTypes';

export default function datasets(
  state = { isFetchingDatasets: false, datasetItems: null },
  action
) {
  switch (action.type) {
    case DATASETS_REQUEST:
      return {
        ...state,
        isFetchingDatasets: true
      };
    case DATASETS_SUCCESS:
      return {
        ...state,
        isFetchingDatasets: false,
        datasetItems: action.payload
      };
    case DATASETS_FAILURE:
      return {
        ...state,
        isFetchingDatasets: false,
        datasetItems: null
      };
    default:
      return state;
  }
}
