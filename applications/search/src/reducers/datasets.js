import { LOCATION_CHANGE } from 'react-router-redux';
import { DATASETS_REQUEST, DATASETS_SUCCESS, DATASETS_FAILURE } from '../constants/ActionTypes';

export default function datasets(state = { isFetchingDatasets: false, datasetItems: null }, action) {
  switch (action.type) {
    case DATASETS_REQUEST:
      return {
        ...state,
        isFetchingDatasets: true
      };
    case DATASETS_SUCCESS:
      console.log("i datasets DATASETS_SUCCESS");
      return {
        ...state,
        isFetchingDatasets: false,
        datasetItems: action.response.data
      }
    case DATASETS_FAILURE:
      console.log("i datasets failure");
      return {
        ...state,
        isFetchingDatasets: false,
        datasetItems: null
      };
    case LOCATION_CHANGE:
      const pathname = '/datasets'; // action.payload.pathname;
      console.log("i datasets LOCATION_CHANGE", pathname);
      // /redux-history-demo/:operation
      const [_, operation = ""] = pathname.split('/');
      return operation;
    default:
      return state;
  }
}
