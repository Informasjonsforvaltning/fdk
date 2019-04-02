import _ from 'lodash';
import axios from 'axios';
import qs from 'qs';

import { normalizeAggregations } from '../lib/normalizeAggregations';
import { apisUrlBase } from './apis';

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

const statsAggregations = `formats,orgPath,firstHarvested,publisher,openAccess,openLicence,freeUsage`;

export const statsUrl = query =>
  `${apisUrlBase}${qs.stringify(
    { ...query, size: 0, aggregations: statsAggregations },
    { addQueryPrefix: true }
  )}`;

export const getApiStats = async orgPath => {
  const response = await axios
    .get(statsUrl({ orgPath }))
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && extractStats(normalizeAggregations(response.data));
};
