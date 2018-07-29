import { fetchActions } from '../fetchActions';

export const DISTRIBUTIONTYPE_REQUEST = 'DISTRIBUTIONTYPE_REQUEST';
export const DISTRIBUTIONTYPE_SUCCESS = 'DISTRIBUTIONTYPE_SUCCESS';
export const DISTRIBUTIONTYPE_FAILURE = 'DISTRIBUTIONTYPE_FAILURE';

export function fetchDistributionTypeIfNeededAction() {
  return (dispatch, getState) => {
    if (!getState().distributionTypes.isFetching) {
      dispatch(
        fetchActions('/reference-data/codes/distributiontype', [
          DISTRIBUTIONTYPE_REQUEST,
          DISTRIBUTIONTYPE_SUCCESS,
          DISTRIBUTIONTYPE_FAILURE
        ])
      );
    }
  };
}

const initialState = {
  isFetchingDistributionType: false,
  distributionTypeItems: null
};

export function distributionTypesReducer(state = initialState, action) {
  switch (action.type) {
    case DISTRIBUTIONTYPE_REQUEST: {
      return {
        ...state,
        isFetchingDistributionType: true
      };
    }
    case DISTRIBUTIONTYPE_SUCCESS: {
      return {
        ...state,
        isFetchingDistributionType: false,
        distributionTypeItems: action.payload
      };
    }
    case DISTRIBUTIONTYPE_FAILURE: {
      return {
        ...state,
        isFetchingDistributionType: false,
        distributionTypeItems: null
      };
    }
    default:
      return state;
  }
}

export const getDistributionTypeByUri = (distributionTypeItems, uri) => {
  if (distributionTypeItems) {
    return distributionTypeItems.filter(type => type.uri === uri);
  }
  return null;
};
