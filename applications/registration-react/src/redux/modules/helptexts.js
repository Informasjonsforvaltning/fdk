import _ from 'lodash';
import { fetchActions } from '../fetchActions';

const HELPTEXTS_REQUEST = 'HELPTEXTS_REQUEST';
const HELPTEXTS_SUCCESS = 'HELPTEXTS_SUCCESS';
const HELPTEXTS_FAILURE = 'HELPTEXTS_FAILURE';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchHelptextsIfNeeded() {
  return (dispatch, getState) =>
    shouldFetch(_.get(getState(), ['helptexts', 'meta'])) &&
    dispatch(
      fetchActions('/reference-data/helptexts', [
        HELPTEXTS_REQUEST,
        HELPTEXTS_SUCCESS,
        HELPTEXTS_FAILURE
      ])
    );
}

const initialState = {};

export default function helptexts(state = initialState, action) {
  switch (action.type) {
    case HELPTEXTS_REQUEST: {
      return {
        ...state,
        meta: {
          isFetching: true,
          lastFetch: null
        }
      };
    }
    case HELPTEXTS_SUCCESS: {
      const objFromArray = action.payload.reduce((accumulator, current) => {
        accumulator[current.id] = current; // eslint-disable-line no-param-reassign
        return accumulator;
      }, {});
      return {
        ...state,
        helptextItems: objFromArray,
        meta: {
          isFetching: false,
          lastFetch: Date.now()
        }
      };
    }
    case HELPTEXTS_FAILURE: {
      return {
        ...state,
        helptextItems: null,
        meta: {
          isFetching: false,
          lastFetch: null
        }
      };
    }
    default:
      return state;
  }
}
