import {
  THEMES_REQUEST,
  THEMES_SUCCESS,
  THEMES_FAILURE
} from '../../constants/ActionTypes';

export default function themes(
  state = { isFetchingThemes: false, themesItems: null },
  action
) {
  switch (action.type) {
    case THEMES_REQUEST:
      return {
        ...state,
        isFetchingThemes: true
      };
    case THEMES_SUCCESS:
      return {
        ...state,
        isFetchingThemes: false,
        themesItems: action.payload
      };
    case THEMES_FAILURE:
      return {
        ...state,
        isFetchingThemes: false,
        themesItems: null
      };
    default:
      return state;
  }
}
