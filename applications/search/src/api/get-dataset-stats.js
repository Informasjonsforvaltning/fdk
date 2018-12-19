import _ from 'lodash';
import axios from 'axios';

import { normalizeAggregations } from '../lib/normalizeAggregations';

function getFromBucketArray(data, aggregation, key) {
  const buckets = _.get(data, ['aggregations', aggregation, 'buckets'], []);
  const bucket = buckets.find(
    bucket => bucket.key.toUpperCase() === key.toUpperCase()
  );
  return _.get(bucket, 'count', 0);
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
    newLastWeek: getFromBucketArray(data, 'firstHarvested', 'last7days'),
    newLastMonth: getFromBucketArray(data, 'firstHarvested', 'last30days'),
    newLastYear: getFromBucketArray(data, 'firstHarvested', 'last365days'),
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
