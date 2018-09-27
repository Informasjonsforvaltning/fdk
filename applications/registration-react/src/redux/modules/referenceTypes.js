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
      const referenceTypesItems = action.payload.map(item => ({
        uri: item.uri,
        code: item.code,
        prefLabel_no: item.prefLabel.nb,
        prefLabel_nb: item.prefLabel.nb
      }));
      return {
        ...state,
        isFetchingReferenceTypes: false,
        referenceTypesItems
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
