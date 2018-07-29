import { fetchActions } from '../fetchActions';

export const THEMES_REQUEST = 'THEMES_REQUEST';
export const THEMES_SUCCESS = 'THEMES_SUCCESS';
export const THEMES_FAILURE = 'THEMES_FAILURE';

export function fetchThemesIfNeededAction() {
  return (dispatch, getState) => {
    if (!getState().themes.isFetching) {
      dispatch(
        fetchActions('/reference-data/themes', [
          THEMES_REQUEST,
          THEMES_SUCCESS,
          THEMES_FAILURE
        ])
      );
    }
  };
}

const initialState = { isFetching: false, themesItems: null };

export function themesReducer(state = initialState, action) {
  switch (action.type) {
    case THEMES_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case THEMES_SUCCESS: {
      const objFromArray = action.payload.reduce((accumulator, current) => {
        accumulator[current.code] = current;
        return accumulator;
      }, {});
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
