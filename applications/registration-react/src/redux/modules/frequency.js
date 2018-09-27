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
      const frequencyItems = action.payload.map(item => ({
        uri: item.uri,
        code: item.code,
        prefLabel_no: item.prefLabel.no,
        prefLabel_nb: item.prefLabel.nb
      }));
      return {
        ...state,
        isFetchingFrequency: false,
        frequencyItems
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
