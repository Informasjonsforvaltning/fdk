import { THEMES_REQUEST, THEMES_SUCCESS, THEMES_FAILURE } from '../ActionTypes';

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
    case THEMES_SUCCESS: {
      const objFromArray = action.response.data.reduce(
        (accumulator, current) => {
          accumulator[current.code] = current;
          return accumulator;
        },
        {}
      );
      return {
        ...state,
        isFetchingThemes: false,
        themesItems: objFromArray
      };
    }
    case THEMES_FAILURE: {
      return {
        ...state,
        isFetchingThemes: false,
        themesItems: null
      };
    }
    default:
      return state;
  }
}
