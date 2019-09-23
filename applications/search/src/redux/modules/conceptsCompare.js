import _ from 'lodash';
import { reduxFsaThunk } from '../../lib/redux-fsa-thunk';
import { getConcept } from '../../api/concepts';

export const CONCEPTSCOMPARE_REQUEST = 'CONCEPTSCOMPARE_REQUEST';
export const CONCEPTSCOMPARE_SUCCESS = 'CONCEPTSCOMPARE_SUCCESS';
export const CONCEPTSCOMPARE_FAILURE = 'CONCEPTSCOMPARE_FAILURE';

export const ADD_CONCEPT_TO_COMPARE = 'ADD_CONCEPT_TO_COMPARE';
export const REMOVE_CONCEPT_TO_COMPARE = 'REMOVE_CONCEPT_TO_COMPARE';

function shouldFetch(metaState) {
  const threshold = 60 * 1000; // seconds
  return (
    !metaState ||
    (!metaState.isFetching &&
      (metaState.lastFetch || 0) < Date.now() - threshold)
  );
}

export function fetchConceptsToCompareIfNeededAction(iDs) {
  return (dispatch, getState) => {
    iDs
      .filter(id => !!id)
      .forEach(id => {
        if (shouldFetch(_.get(getState(), ['conceptsCompare', 'meta', id]))) {
          dispatch(
            reduxFsaThunk(() => getConcept(id), {
              onBeforeStart: { type: CONCEPTSCOMPARE_REQUEST, meta: { id } },
              onSuccess: { type: CONCEPTSCOMPARE_SUCCESS, meta: { id } },
              onError: { type: CONCEPTSCOMPARE_FAILURE, meta: { id } }
            })
          );
        }
      });
  };
}

export function addConceptAction(item) {
  return {
    type: ADD_CONCEPT_TO_COMPARE,
    conceptItem: item
  };
}

export function removeConceptAction(id) {
  return {
    type: REMOVE_CONCEPT_TO_COMPARE,
    id
  };
}

const initialState = {
  items: {},
  meta: {}
};

export function conceptsCompareReducer(state = initialState, action) {
  switch (action.type) {
    case CONCEPTSCOMPARE_REQUEST:
      return {
        items: {
          ...state.items,
          [action.meta.id]: action.payload
        },
        meta: {
          ...state.meta,
          [action.meta.id]: { isFetching: false, lastFetch: Date.now() }
        }
      };
    case CONCEPTSCOMPARE_SUCCESS:
      return {
        items: {
          ...state.items,
          [action.meta.id]: action.payload
        },
        meta: {
          ...state.meta,
          [action.meta.id]: { isFetching: false, lastFetch: Date.now() }
        }
      };
    case CONCEPTSCOMPARE_FAILURE:
      return {
        items: {
          ...state.items,
          [action.meta.id]: undefined
        },
        meta: {
          ...state.meta,
          [action.meta.id]: { isFetching: false, lastFetch: null }
        }
      };
    case ADD_CONCEPT_TO_COMPARE:
      return {
        items: {
          ...state.items,
          [action.conceptItem.id]: action.conceptItem
        },
        meta: {
          ...state.meta,
          [action.conceptItem.id]: { isFetching: false, lastFetch: Date.now() }
        }
      };
    case REMOVE_CONCEPT_TO_COMPARE:
      return {
        items: Object.keys(state.items).reduce((accumulator, key) => {
          if (key !== action.id) {
            accumulator[key] = state.items[key];
          }
          return accumulator;
        }, {})
      };
    default:
      return state;
  }
}
