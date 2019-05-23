import {
  FREQUENCY_REQUEST,
  FREQUENCY_SUCCESS,
  FREQUENCY_FAILURE
} from '../../constants/ActionTypes';

export default function provenance(
  state = { isFetchingFrequency: false, frequencyItems: null },
  action
) {
  switch (action.type) {
    case FREQUENCY_REQUEST:
      return {
        ...state,
        isFetchingFrequency: true
      };
    case FREQUENCY_SUCCESS: {
      return {
        ...state,
        isFetchingFrequency: false,
        frequencyItems: action.payload
      };
    }
    case FREQUENCY_FAILURE: {
      return {
        ...state,
        isFetchingFrequency: false,
        frequencyItems: null
      };
    }
    default:
      return state;
  }
}
