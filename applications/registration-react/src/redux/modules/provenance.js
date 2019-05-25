import {
  PROVENANCE_REQUEST,
  PROVENANCE_SUCCESS,
  PROVENANCE_FAILURE
} from '../../constants/ActionTypes';

export default function provenance(
  state = { isFetchingProvenance: false, provenanceItems: null },
  action
) {
  switch (action.type) {
    case PROVENANCE_REQUEST: {
      return {
        ...state,
        isFetchingProvenance: true
      };
    }
    case PROVENANCE_SUCCESS: {
      return {
        ...state,
        isFetchingProvenance: false,
        provenanceItems: action.payload
      };
    }
    case PROVENANCE_FAILURE: {
      return {
        ...state,
        isFetchingProvenance: false,
        provenanceItems: null
      };
    }
    default:
      return state;
  }
}
