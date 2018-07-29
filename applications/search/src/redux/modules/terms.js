import _ from 'lodash';
import { addOrReplaceParam } from '../../lib/addOrReplaceUrlParam';
import { fetchActions } from '../fetchActions';

export const TERMS_REQUEST = 'TERMS_REQUEST';
export const TERMS_SUCCESS = 'TERMS_SUCCESS';
export const TERMS_FAILURE = 'TERMS_FAILURE';

export function fetchTermsIfNeededAction(termsURL) {
  // add static size parameter
  const url = addOrReplaceParam(termsURL, 'size', '50');
  return (dispatch, getState) => {
    if (!getState().terms.isFetching) {
      dispatch(
        fetchActions(url, [TERMS_REQUEST, TERMS_SUCCESS, TERMS_FAILURE])
      );
    }
  };
}

const initialState = {
  isFetching: false,
  termItems: null,
  publisherCountTermItems: null
};

export function termsReducer(state = initialState, action) {
  switch (action.type) {
    case TERMS_REQUEST: {
      return {
        ...state,
        isFetching: true
      };
    }
    case TERMS_SUCCESS: {
      const orgs = action.payload.aggregations.orgPath.buckets;
      const flat = _(orgs).forEach(f => {
        const filteredOrgs = _(orgs)
          .filter(g => g.key.substring(0, g.key.lastIndexOf('/')) === f.key)
          .value();
        filteredOrgs.forEach(item => {
          const retVal = item;
          retVal.hasParent = true;
          return retVal;
        });
        const retVal = f;
        retVal.children = filteredOrgs;
        return retVal;
      });
      const resultArray = _(flat)
        .filter(f => !f.hasParent)
        .value();
      return {
        ...state,
        isFetching: false,
        termItems: action.payload,
        publisherCountTermItems: resultArray
      };
    }
    case TERMS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        termItems: null,
        publisherCountTermItems: null
      };
    }
    default:
      return state;
  }
}
