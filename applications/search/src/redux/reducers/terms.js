import _ from 'lodash';
import { TERMS_REQUEST, TERMS_SUCCESS, TERMS_FAILURE } from '../ActionTypes';

export default function terms(
  state = {
    isFetchingTerms: false,
    termItems: null,
    publisherCountTermItems: null
  },
  action
) {
  switch (action.type) {
    case TERMS_REQUEST: {
      return {
        ...state,
        isFetchingTerms: true
      };
    }
    case TERMS_SUCCESS: {
      const orgs = action.response.data.aggregations.orgPath.buckets;
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
        isFetchingTerms: false,
        termItems: action.response.data,
        publisherCountTermItems: resultArray
      };
    }
    case TERMS_FAILURE: {
      return {
        ...state,
        isFetchingTerms: false,
        termItems: null,
        publisherCountTermItems: null
      };
    }
    default:
      return state;
  }
}
