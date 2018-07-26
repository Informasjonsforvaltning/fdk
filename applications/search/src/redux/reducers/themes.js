import { THEMES_REQUEST, THEMES_SUCCESS, THEMES_FAILURE } from '../ActionTypes';

export default function themes(
  state = { isFetching: false, themesItems: null },
  action
) {
  switch (action.type) {
    case THEMES_REQUEST:
      return {
        ...state,
        isFetching: true
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
        isFetching: false,
        themesItems: objFromArray
      };
    }
    case THEMES_FAILURE: {
      return {
        ...state,
        isFetching: false,
        themesItems: null
      };
    }
    default:
      return state;
  }
}
