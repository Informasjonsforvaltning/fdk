import {
  DATASET_REQUEST,
  DATASET_SUCCESS,
  DATASET_FAILURE
} from '../constants/ActionTypes';

export default function dataset(
  state = { isFetching: false, result: null },
  action
) {
  switch (action.type) {
    case DATASET_REQUEST: {
      return {
        ...state,
        isFetching: true
      };
    }
    case DATASET_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        result: action.response.data
      };
    }
    case DATASET_FAILURE: {
      return {
        ...state,
        isFetching: false,
        result: null
      };
    }
    default:
      return state;
  }
}
