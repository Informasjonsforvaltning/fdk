import { fetchActions } from '../fetchActions';

export const REFERENCEETYPES_REQUEST = 'REFERENCEETYPES_REQUEST';
export const REFERENCEETYPES_SUCCESS = 'REFERENCEETYPES_SUCCESS';
export const REFERENCEETYPES_FAILURE = 'REFERENCEETYPES_FAILURE';

function shouldFetch(state) {
  const threshold = 60 * 1000; // seconds
  return (
    !state.isFetchingReferenceTypes &&
    (state.lastFetch || 0) < Date.now() - threshold
  );
}

export function fetchReferenceTypesIfNeededAction() {
  return (dispatch, getState) => {
    if (shouldFetch(getState().referenceTypes)) {
      dispatch(
        fetchActions('/reference-data/codes/referencetypes', [
          REFERENCEETYPES_REQUEST,
          REFERENCEETYPES_SUCCESS,
          REFERENCEETYPES_FAILURE
        ])
      );
    }
  };
}

const initialState = {
  isFetchingReferenceTypes: false,
  referenceTypeItems: null
};

export function referenceTypesReducer(state = initialState, action) {
  switch (action.type) {
    case REFERENCEETYPES_REQUEST: {
      return {
        ...state,
        isFetchingReferenceTypes: true,
        lastFetch: null
      };
    }
    case REFERENCEETYPES_SUCCESS: {
      return {
        ...state,
        isFetchingReferenceTypes: false,
        lastFetch: Date.now(),
        referenceTypeItems: action.payload
      };
    }
    case REFERENCEETYPES_FAILURE: {
      return {
        ...state,
        isFetchingReferenceTypes: false,
        lastFetch: null,
        referenceTypeItems: null
      };
    }
    default:
      return state;
  }
}

export const getReferenceTypeByUri = (referenceTypeItems, uri) => {
  if (referenceTypeItems) {
    return referenceTypeItems.filter(
      referenceType => referenceType.uri === uri
    );
  }
  return null;
};
