import {
  TERMS_REQUEST,
  TERMS_SUCCESS,
  TERMS_FAILURE
} from "../constants/ActionTypes";

export default function terms(
  state = { isFetchingTerms: false, termItems: null },
  action
) {
  switch (action.type) {
    case TERMS_REQUEST:
      return {
        ...state,
        isFetchingTerms: true
      };
    case TERMS_SUCCESS:
      return {
        ...state,
        isFetchingTerms: false,
        termItems: action.response.data
      };
    case TERMS_FAILURE:
      return {
        ...state,
        isFetchingTerms: false,
        termItems: null
      };
    default:
      return state;
  }
}
