import {
  CATALOG_REQUEST,
  CATALOG_SUCCESS,
  CATALOG_FAILURE
} from '../../constants/ActionTypes';

export default function catalog(
  state = { isFetchingCatalog: false, catalogItem: null },
  action
) {
  switch (action.type) {
    case CATALOG_REQUEST:
      return {
        ...state,
        isFetchingCatalog: true
      };
    case CATALOG_SUCCESS:
      return {
        ...state,
        isFetchingCatalog: false,
        catalogItem: action.payload
      };
    case CATALOG_FAILURE:
      return {
        ...state,
        isFetchingCatalog: false,
        catalogItem: null
      };
    default:
      return state;
  }
}
