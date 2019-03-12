import _ from 'lodash';
import axios from 'axios';
import qs from 'qs';

import { normalizeAggregations } from '../lib/normalizeAggregations';
import { datasetsUrlBase, searchAggregations } from './datasets';

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
    public: getFromBucketArray(data, 'accessRights', 'PUBLIC'),
    restricted: getFromBucketArray(data, 'accessRights', 'RESTRICTED'),
    nonPublic: getFromBucketArray(data, 'accessRights', 'NON_PUBLIC'),
    unknown: getFromBucketArray(data, 'accessRights', 'UKJENT'),
    opendata: getFromAggregation(data, 'opendata'),
    newLastWeek: getFromBucketArray(data, 'firstHarvested', 'last7days'),
    newLastMonth: getFromBucketArray(data, 'firstHarvested', 'last30days'),
    newLastYear: getFromBucketArray(data, 'firstHarvested', 'last365days'),
    distributions: getFromAggregation(data, 'withDistribution'),
    distOnPublicAccessCount: getFromAggregation(data, 'publicWithDistribution'),
    subjectCount: getFromAggregation(data, 'withSubject'),
    catalogCounts: _.get(data, ['aggregations', 'catalog', 'buckets'], [])
  };
}

const statsAggregations = `${searchAggregations},firstHarvested,withDistribution,publicWithDistribution,nonpublicWithDistribution,publicWithoutDistribution,nonpublicWithoutDistribution,withSubject,catalog,opendata,nationalComponent,subjects`;

export const statsUrl = query =>
  `${datasetsUrlBase}${qs.stringify(
    { ...query, size: 0, aggregations: statsAggregations },
    { addQueryPrefix: true }
  )}`;

export const getDatasetStats = async query => {
  const response = await axios
    .get(statsUrl(query))
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && extractStats(normalizeAggregations(response.data));
};
