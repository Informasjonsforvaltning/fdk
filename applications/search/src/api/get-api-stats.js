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
    newLastWeek: getFromBucketArray(data, 'firstHarvested', 'last7days')
  };
}

const statsAggregations = `firstHarvested`;

export const statsUrl = query =>
  `${apisUrlBase}${qs.stringify(
    { ...query, size: 0, aggregations: statsAggregations },
    { addQueryPrefix: true }
  )}`;

export const getApiStats = async query => {
  const response = await axios
    .get(statsUrl(query))
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

  return response && extractStats(normalizeAggregations(response.data));
};
