import _ from 'lodash';
import { resolve } from 'react-resolver';
import axios from 'axios';
import { ConnectedReportStats } from './connected-report-stats';

function getFromBucketArray(data, aggregation, key) {
  const buckets = _.get(data, ['aggregations', aggregation, 'buckets'], []);
  const bucket = buckets.find(
    bucket => bucket.key.toUpperCase() === key.toUpperCase()
  );
  return _.get(bucket, 'doc_count', 0);
}

function getFromBucketKeyed(data, aggregation, key) {
  return _.get(
    data,
    ['aggregations', aggregation, 'buckets', key, 'doc_count'],
    0
  );
}

function getFromAggregation(data, aggregation) {
  return _.get(data, ['aggregations', aggregation, 'doc_count'], 0);
}

export function extractStats(data) {
  return {
    total: _.get(data, 'hits.total', 0),
    public: getFromBucketArray(data, 'accessRightsCount', 'PUBLIC'),
    restricted: getFromBucketArray(data, 'accessRightsCount', 'RESTRICTED'),
    nonPublic: getFromBucketArray(data, 'accessRightsCount', 'NON_PUBLIC'),
    unknown: getFromBucketArray(data, 'accessRightsCount', 'UKJENT'),
    opendata: getFromAggregation(data, 'opendata'),
    newLastWeek: getFromBucketKeyed(data, 'firstHarvested', 'last7days'),
    newLastMonth: getFromBucketKeyed(data, 'firstHarvested', 'last30days'),
    newLastYear: getFromBucketKeyed(data, 'firstHarvested', 'last365days'),
    distributions: getFromAggregation(data, 'distCount'),
    distOnPublicAccessCount: getFromAggregation(
      data,
      'distOnPublicAccessCount'
    ),
    subjectCount: getFromAggregation(data, 'subjectCount')
  };
}

const mapProps = {
  stats: async props => {
    const query = props.orgPath || '';
    const response = await axios.get(`/aggregateDataset?q=${query}`);

    return extractStats(response.data);
  }
};

export const ResolvedReportStats = resolve(mapProps)(ConnectedReportStats);
