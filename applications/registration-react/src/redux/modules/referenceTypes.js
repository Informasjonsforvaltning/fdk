import {
  REFERENCETYPES_REQUEST,
  REFERENCETYPES_SUCCESS,
  REFERENCETYPES_FAILURE
} from '../../constants/ActionTypes';

export default function referenceTypes(
  state = { isFetchingReferenceTypes: false, referenceTypesItems: null },
  action
) {
  switch (action.type) {
    case REFERENCETYPES_REQUEST: {
      return {
        ...state,
        isFetchingReferenceTypes: true
      };
    }
    case REFERENCETYPES_SUCCESS: {
      return {
        ...state,
        isFetchingReferenceTypes: false,
        referenceTypesItems: action.payload
      };
    }
    case REFERENCETYPES_FAILURE: {
      return {
        ...state,
        isFetchingReferenceTypes: false,
        referenceTypesItems: null
      };
    }
    default:
      return state;
  }
}
