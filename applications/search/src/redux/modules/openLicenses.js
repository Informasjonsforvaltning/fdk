import { fetchActions } from '../fetchActions';

export const OPENLICENSES_REQUEST = 'OPENLICENSES_REQUEST';
export const OPENLICENSES_SUCCESS = 'OPENLICENSES_SUCCESS';
export const OPENLICENSES_FAILURE = 'OPENLICENSES_FAILURE';

export function fetchOpenLicensesIfNeededAction() {
  return (dispatch, getState) => {
    if (!getState().openLicenses.isFetching) {
      dispatch(
        fetchActions('/reference-data/codes/openlicenses', [
          OPENLICENSES_REQUEST,
          OPENLICENSES_SUCCESS,
          OPENLICENSES_FAILURE
        ])
      );
    }
  };
}

const initialState = {
  isFetching: false,
  openLicenseItems: null
};

export function openLicensesReducer(state = initialState, action) {
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
        openLicenseItems: action.payload
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
