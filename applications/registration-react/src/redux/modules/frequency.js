import _ from 'lodash';
import {
  FREQUENCY_REQUEST,
  FREQUENCY_SUCCESS,
  FREQUENCY_FAILURE
} from '../../constants/ActionTypes';
import getTranslateText from '../../lib/translateText';

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
        prefLabel_no: getTranslateText(_.get(item, 'prefLabel'))
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
