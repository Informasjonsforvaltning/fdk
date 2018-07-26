import {
  OPENLICENSES_REQUEST,
  OPENLICENSES_SUCCESS,
  OPENLICENSES_FAILURE
} from '../ActionTypes';

export default function openLicenses(
  state = {
    isFetching: false,
    openLicenseItems: null
  },
  action
) {
  switch (action.type) {
    case OPENLICENSES_REQUEST: {
      return {
        ...state,
        isFetching: true
      };
    }
    case OPENLICENSES_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        openLicenseItems: action.response.data
      };
    }
    case OPENLICENSES_FAILURE: {
      return {
        ...state,
        isFetching: false,
        openLicenseItems: null
      };
    }
    default:
      return state;
  }
}

export const getOpenLicenseByUri = (openLicenseItems, uri) => {
  if (openLicenseItems) {
    return openLicenseItems.filter(license => license.uri === uri);
  }
  return null;
};
