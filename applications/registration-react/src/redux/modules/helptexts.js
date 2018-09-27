import {
  HELPTEXTS_REQUEST,
  HELPTEXTS_SUCCESS,
  HELPTEXTS_FAILURE
} from '../../constants/ActionTypes';

export default function dataset(
  state = { isFetchingHelptext: false, helptextItems: null },
  action
) {
  switch (action.type) {
    case HELPTEXTS_REQUEST: {
      return {
        ...state,
        isFetchingHelptext: true
      };
    }
    case HELPTEXTS_SUCCESS: {
      const objFromArray = action.payload.reduce((accumulator, current) => {
        accumulator[current.id] = current; // eslint-disable-line no-param-reassign
        return accumulator;
      }, {});
      return {
        ...state,
        isFetchingHelptext: false,
        helptextItems: objFromArray
      };
    }
    case HELPTEXTS_FAILURE: {
      return {
        ...state,
        isFetchingHelptext: false,
        helptextItems: null
      };
    }
    default:
      return state;
  }
}
