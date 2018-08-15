import { fetchActions } from '../fetchActions';

export const DISTRIBUTIONTYPE_REQUEST = 'DISTRIBUTIONTYPE_REQUEST';
export const DISTRIBUTIONTYPE_SUCCESS = 'DISTRIBUTIONTYPE_SUCCESS';
export const DISTRIBUTIONTYPE_FAILURE = 'DISTRIBUTIONTYPE_FAILURE';

function shouldFetch(state) {
  const STALE_THRESHOLD = 60 * 1000; // Stale after 1 minute
  const isFresh = (state.lastFetch || 0) > Date.now() - STALE_THRESHOLD;
  return !state.isFetching && !isFresh;
}

export function fetchDistributionTypeIfNeededAction() {
  return (dispatch, getState) => {
    if (shouldFetch(getState().distributionTypes)) {
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
        isFetching: true,
        lastFetch: null
      };
    }
    case DISTRIBUTIONTYPE_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        lastFetch: Date.now(),
        distributionTypeItems: action.payload
      };
    }
    case DISTRIBUTIONTYPE_FAILURE: {
      return {
        ...state,
        isFetching: false,
        lastFetch: null,
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
