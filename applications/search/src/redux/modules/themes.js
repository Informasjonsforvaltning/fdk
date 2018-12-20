import _ from 'lodash';
import { fetchActions } from '../fetchActions';

export const THEMES_REQUEST = 'THEMES_REQUEST';
export const THEMES_SUCCESS = 'THEMES_SUCCESS';
export const THEMES_FAILURE = 'THEMES_FAILURE';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchThemesIfNeededAction() {
  return (dispatch, getState) => {
    if (shouldFetch(_.get(getState(), ['themes', 'meta']))) {
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

const initialState = { items: {}, meta: {} };

export function themesReducer(state = initialState, action) {
  switch (action.type) {
    case THEMES_REQUEST:
      return {
        themesItems: { ...state.items },
        meta: {
          ...state.meta,
          isFetching: true,
          lastFetch: null
        }
      };
    case THEMES_SUCCESS: {
      const objFromArray = action.payload.reduce((accumulator, current) => {
        accumulator[current.code] = current;
        return accumulator;
      }, {});
      return {
        ...state,
        meta: {
          isFetching: false,
          lastFetch: Date.now()
        },
        themesItems: objFromArray
      };
    }
    case THEMES_FAILURE: {
      return {
        ...state,
        meta: {
          ...state.meta,
          isFetching: false,
          lastFetch: null
        }
      };
    }
    default:
      return state;
  }
}
