import {
  OPENLICENSES_REQUEST,
  OPENLICENSES_SUCCESS,
  OPENLICENSES_FAILURE
} from '../../constants/ActionTypes';

export default function openlicenses(
  state = { isFetchingOpenLicenses: false, openLicenseItems: null },
  action
) {
  switch (action.type) {
    case OPENLICENSES_REQUEST:
      return {
        ...state,
        isFetchingOpenLicenses: true
      };
    case OPENLICENSES_SUCCESS: {
      return {
        ...state,
        isFetchingOpenLicenses: false,
        openLicenseItems: action.payload
      };
    }
    case OPENLICENSES_FAILURE:
      return {
        ...state,
        isFetchingOpenLicenses: false,
        openLicenseItems: null
      };
    default:
      return state;
  }
}
