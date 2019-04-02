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
    publicWithDistribution: getFromAggregation(data, 'publicWithDistribution'),
    publicWithoutDistribution: getFromAggregation(
      data,
      'publicWithoutDistribution'
    ),
    nonpublicWithDistribution: getFromAggregation(
      data,
      'nonpublicWithDistribution'
    ),
    nonpublicWithoutDistribution: getFromAggregation(
      data,
      'nonpublicWithoutDistribution'
    ),
    distributionCountForTypeApi: getFromAggregation(
      data,
      'distributionCountForTypeApi'
    ),
    distributionCountForTypeFeed: getFromAggregation(
      data,
      'distributionCountForTypeFeed'
    ),
    distributionCountForTypeFile: getFromAggregation(
      data,
      'distributionCountForTypeFile'
    ),
    nationalComponent: getFromAggregation(data, 'nationalComponent'),
    subjectCount: getFromAggregation(data, 'withSubject'),
    catalogCounts: _.get(data, ['aggregations', 'catalog', 'buckets'], []),
    subjectCounts: _.get(data, ['aggregations', 'subject', 'buckets'], [])
  };
}

const statsAggregations = `${searchAggregations},firstHarvested,withDistribution,publicWithDistribution,nonpublicWithDistribution,publicWithoutDistribution,nonpublicWithoutDistribution,withSubject,catalog,opendata,nationalComponent,subject,distributionCountForTypeApi,distributionCountForTypeFeed,distributionCountForTypeFile`;

export const statsUrl = query =>
  `${datasetsUrlBase}${qs.stringify(
    { ...query, size: 0, aggregations: statsAggregations },
    { addQueryPrefix: true }
  )}`;

export const getDatasetStats = orgPath =>
  axios
    .get(statsUrl({ orgPath }))
    .then(response => response && response.data)
    .then(normalizeAggregations)
    .then(extractStats)
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console

export const getDatasetCountsBySubjectUri = query => {
  const postUrl = `${datasetsUrlBase}/search${qs.stringify(
    { returnfields: 'subject.uri', size: 10000 },
    // todo size 10000 is currently overruled by server to be 100, fix the limit there, if we come closer to that limit of concept referrals from datasets
    // alternative is to implement paged querying here.
    { addQueryPrefix: true }
  )}`;

  return axios
    .post(postUrl, query)
    .then(response => response && response.data)
    .then(data => _.get(data, 'hits.hits'))
    .then(datasets =>
      datasets.map(r =>
        _.get(r, '_source.subject', []).map(subject => ({
          subjectUri: subject.uri,
          datasetId: r._id
        }))
      )
    )
    .then(_.flatten) // [[subject, ...],[subject, ...]] -> [subject..]
    .then(subjects => _.groupBy(subjects, 'subjectUri'))
    .catch(e => console.log(JSON.stringify(e))); // eslint-disable-line no-console
};
