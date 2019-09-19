import _ from 'lodash';
import axios from 'axios';

import { normalizeAggregations } from '../lib/normalizeAggregations';
import { apisUrlBase } from './apis';
import { getConfig } from '../config';

function getFromBucketArray(data, aggregation, key) {
  const buckets = _.get(data, ['aggregations', aggregation, 'buckets'], []);
  const bucket = buckets.find(
    bucket => bucket.key.toUpperCase() === key.toUpperCase()
  );
  return _.get(bucket, 'count', 0);
}

export function extractStats(data) {
  return {
    total: _.get(data, 'total', 0),
    newLastWeek: getFromBucketArray(data, 'firstHarvested', 'last7days'),
    openLicense: getFromBucketArray(data, 'openLicence', 'true'),
    notOpenLicense: getFromBucketArray(data, 'openLicence', 'false'),
    missingOpenLicense: getFromBucketArray(data, 'openLicence', 'MISSING'),
    openAccess: getFromBucketArray(data, 'openAccess', 'true'),
    notOpenAccess: getFromBucketArray(data, 'openAccess', 'false'),
    missingOpenAccess: getFromBucketArray(data, 'openAccess', 'MISSING'),
    freeUsage: getFromBucketArray(data, 'freeUsage', 'true'),
    notFreeUsage: getFromBucketArray(data, 'freeUsage', 'false'),
    missingFreeUsage: getFromBucketArray(data, 'freeUsage', 'MISSING'),
    formatCounts: _.get(data, ['aggregations', 'formats', 'buckets'], [])
  };
}

export const getApiStats = orgPath =>
  axios
    .get(apisUrlBase(), {
      ...getConfig().apiApi.config,
      params: {
        orgPath,
        size: 0,
        aggregations:
          'formats,orgPath,firstHarvested,publisher,openAccess,openLicence,freeUsage'
      }
    })
    .then(r => r.data)
    .then(normalizeAggregations)
    .then(extractStats);
