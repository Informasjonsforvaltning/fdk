import _ from 'lodash';
import {
  DATASETS_REQUEST,
  DATASETS_SUCCESS,
  DATASETS_FAILURE
} from '../ActionTypes';

const createNestedListOfPublishers = listOfPublishers => {
  const nestedListOfPublishers = _(listOfPublishers).forEach(publisherItem => {
    const filteredChildrenOfParentPublishers = _(listOfPublishers)
      .filter(
        g => g.key.substring(0, g.key.lastIndexOf('/')) === publisherItem.key
      )
      .value();

    filteredChildrenOfParentPublishers.forEach(item => {
      const retVal = item;
      retVal.hasParent = true;
      return retVal;
    });

    const retVal = publisherItem;
    retVal.children = filteredChildrenOfParentPublishers;
    return retVal;
  });

  const resultArray = _(nestedListOfPublishers)
    .filter(f => !f.hasParent)
    .value();

  return resultArray;
};

export default function datasets(
  state = {
    isFetchingDatasets: false,
    datasetItems: null,
    publisherCountItems: null
  },
  action
) {
  switch (action.type) {
    case DATASETS_REQUEST: {
      return {
        ...state,
        isFetchingDatasets: true
      };
    }
    case DATASETS_SUCCESS: {
      const objFromArray = action.response.data.aggregations.subjectsCount.buckets.reduce(
        (accumulator, current) => {
          accumulator[current.key] = current; // eslint-disable-line no-param-reassign
          return accumulator;
        },
        {}
      );
      return {
        ...state,
        isFetchingDatasets: false,
        datasetItems: action.response.data,
        publisherCountItems: createNestedListOfPublishers(
          action.response.data.aggregations.orgPath.buckets
        ),
        subjectsCountItems: objFromArray
      };
    }
    case DATASETS_FAILURE: {
      return {
        ...state,
        isFetchingDatasets: false,
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
