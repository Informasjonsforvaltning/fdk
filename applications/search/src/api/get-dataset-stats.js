import _ from 'lodash';
import axios from 'axios';

import { normalizeAggregations } from '../lib/normalizeAggregations';
import { datasetsUrlBase } from './datasets';
import { getConfig } from '../config';

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

export const getDatasetStats = orgPath =>
  axios
    .get(datasetsUrlBase(), {
      ...getConfig().datasetApi.config,
      params: {
        orgPath,
        size: 0,
        aggregations:
          'accessRights,theme,orgPath,provenance,spatial,los,firstHarvested,withDistribution,publicWithDistribution,nonpublicWithDistribution,publicWithoutDistribution,nonpublicWithoutDistribution,withSubject,catalog,opendata,nationalComponent,subject,distributionCountForTypeApi,distributionCountForTypeFeed,distributionCountForTypeFile'
      }
    })
    .then(response => response && response.data)
    .then(normalizeAggregations)
    .then(extractStats);

export const getDatasetCountsBySubjectUri = query =>
  axios
    .post(`${datasetsUrlBase()}/search`, query, {
      ...getConfig().datasetApi.config,
      params: { returnfields: 'subject.uri', size: 10000 }
    })
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
    .then(subjects => _.groupBy(subjects, 'subjectUri'));
