import _ from 'lodash';
import {
  DATASETS_REQUEST,
  DATASETS_SUCCESS,
  DATASETS_FAILURE
} from '../ActionTypes';

export default function datasets(
  state = {
    isFetching: false,
    datasetItems: null,
    publisherCountItems: null
  },
  action
) {
  switch (action.type) {
    case DATASETS_REQUEST: {
      return {
        ...state,
        isFetching: true
      };
    }
    case DATASETS_SUCCESS: {
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

      const objFromArray = action.payload.aggregations.subjectsCount.buckets.reduce(
        (accumulator, current) => {
          accumulator[current.key] = current; // eslint-disable-line no-param-reassign
          return accumulator;
        },
        {}
      );
      return {
        ...state,
        isFetching: false,
        datasetItems: action.payload,
        publisherCountItems: resultArray,
        subjectsCountItems: objFromArray
      };
    }
    case DATASETS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        datasetItems: null,
        publisherCountItems: null
      };
    }
    default:
      return state;
  }
}

export const getDatasetById = (datasets, id) => {
  if (datasets && datasets.datasetItems && datasets.datasetItems.hits) {
    return datasets.datasetItems.hits.hits.filter(
      dataset => dataset._source.id === id
    );
  }
  return null;
};
