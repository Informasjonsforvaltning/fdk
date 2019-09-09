import _ from 'lodash';
import axios from 'axios';
import qs from 'qs';

import { normalizeAggregations } from '../lib/normalizeAggregations';
import { conceptsUrlBase } from './concepts';
import { getDatasetCountsBySubjectUri } from './get-dataset-stats';

function getFromBucketArray(data, aggregation, key) {
  const buckets = _.get(data, ['aggregations', aggregation, 'buckets'], []);
  const bucket = buckets.find(
    bucket => bucket.key.toUpperCase() === key.toUpperCase()
  );
  return _.get(bucket, 'count', 0);
}

export function extractStats(data) {
  return {
    total: _.get(data, 'page.totalElements', 0),
    newLastWeek: getFromBucketArray(data, 'firstHarvested', 'last7days'),
    publisher: _.get(data, ['aggregations', 'publisher', 'buckets'])
  };
}

const statsAggregations = `firstHarvested,publisher`;

export const statsUrl = query =>
  `${conceptsUrlBase()}${qs.stringify(
    {
      ...query,
      size: 10000,
      returnfields: 'uri',
      aggregations: statsAggregations
    },
    { addQueryPrefix: true }
  )}`;

const extractConcepts = data => _.get(data, '_embedded.concepts');

const extractConceptUris = data =>
  _.map(extractConcepts(data), 'uri').join(',');

export const getConceptStats = orgPath =>
  axios
    .get(statsUrl({ orgPath }))
    .then(response => response && response.data)
    .then(async data => {
      const stats = extractStats(normalizeAggregations(data));
      const datasetCountsByConceptUri = await getDatasetCountsBySubjectUri({
        subject: extractConceptUris(data)
      });

      return { ...stats, datasetCountsByConceptUri };
    })
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console
