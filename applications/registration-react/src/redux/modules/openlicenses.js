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
      const openLicenseItems = action.payload.map(item => ({
        uri: item.uri,
        code: item.code,
        prefLabel_no: item.prefLabel.no,
        prefLabel_nb: item.prefLabel.nb
      }));
      return {
        ...state,
        isFetchingOpenLicenses: false,
        openLicenseItems
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
