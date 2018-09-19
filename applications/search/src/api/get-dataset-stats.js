import _ from 'lodash';
import axios from 'axios';

import { normalizeAggregations } from './normalizeAggregations';

function getFromBucketArray(data, aggregation, key) {
  const buckets = _.get(data, ['aggregations', aggregation, 'buckets'], []);
  const bucket = buckets.find(
    bucket => bucket.key.toUpperCase() === key.toUpperCase()
  );
  return _.get(bucket, 'count', 0);
}

function getFromBucketKeyed(data, aggregation, key) {
  return _.get(data, ['aggregations', aggregation, 'buckets', key, 'count'], 0);
}

function getFromAggregation(data, aggregation) {
  return _.get(data, ['aggregations', aggregation, 'count'], 0);
}

export function extractStats(data) {
  return {
    total: _.get(data, 'hits.total', 0),
    public: getFromBucketArray(data, 'accessRightsCount', 'PUBLIC'),
    restricted: getFromBucketArray(data, 'accessRightsCount', 'RESTRICTED'),
    nonPublic: getFromBucketArray(data, 'accessRightsCount', 'NON_PUBLIC'),
    unknown: getFromBucketArray(data, 'accessRightsCount', 'UKJENT'),
    opendata: getFromAggregation(data, 'opendata'),
    newLastWeek: _.get(data, 'aggregations.firstHarvested.buckets[0].last7days'),
    newLastMonth: _.get(data, 'aggregations.firstHarvested.buckets[1].last30days'),
    newLastYear: _.get(data, 'aggregations.firstHarvested.buckets[2].last365days'),
    distributions: getFromAggregation(data, 'distCount'),
    distOnPublicAccessCount: getFromAggregation(
      data,
      'distOnPublicAccessCount'
    ),
    subjectCount: getFromAggregation(data, 'subjectCount'),
    catalogCounts: _.get(data, ['aggregations', 'catalogs', 'buckets'], [])
  };
}

export const getDatasetStats = async query => {
  const q = query || '';
  const response = await axios
    .get(`/aggregateDataset?q=${q}`)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console
  return response && extractStats(normalizeAggregations(response.data));
};
