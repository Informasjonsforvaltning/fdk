import _ from 'lodash';
import { resolve } from 'react-resolver';
import axios from 'axios';
import { ReportStats } from './report-stats.component';

export function extractStats(aggregateDataset) {
  return {
    total: aggregateDataset.hits ? aggregateDataset.hits.total : 0,
    public:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.accessRightsCount.buckets.find(
        bucket => bucket.key.toUpperCase() === 'PUBLIC'
      )
        ? aggregateDataset.aggregations.accessRightsCount.buckets.find(
            bucket => bucket.key.toUpperCase() === 'PUBLIC'
          ).doc_count
        : 0,
    restricted:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.accessRightsCount.buckets.find(
        bucket => bucket.key.toUpperCase() === 'RESTRICTED'
      )
        ? aggregateDataset.aggregations.accessRightsCount.buckets.find(
            bucket => bucket.key.toUpperCase() === 'RESTRICTED'
          ).doc_count
        : 0,
    nonPublic:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.accessRightsCount.buckets.find(
        bucket => bucket.key.toUpperCase() === 'NON_PUBLIC'
      )
        ? aggregateDataset.aggregations.accessRightsCount.buckets.find(
            bucket => bucket.key.toUpperCase() === 'NON_PUBLIC'
          ).doc_count
        : 0,
    unknown:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.accessRightsCount.buckets.find(
        bucket => bucket.key.toUpperCase() === 'UKJENT'
      )
        ? aggregateDataset.aggregations.accessRightsCount.buckets.find(
            bucket => bucket.key.toUpperCase() === 'UKJENT'
          ).doc_count
        : 0,
    opendata: _.get(aggregateDataset, 'aggregations.opendata.doc_count', 0),
    newLastWeek:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.firstHarvested.buckets &&
      aggregateDataset.aggregations.firstHarvested.buckets.last7days
        ? aggregateDataset.aggregations.firstHarvested.buckets.last7days
            .doc_count
        : 0,

    newLastMonth:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.firstHarvested.buckets &&
      aggregateDataset.aggregations.firstHarvested.buckets.last30days
        ? aggregateDataset.aggregations.firstHarvested.buckets.last30days
            .doc_count
        : 0,

    newLastYear:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.firstHarvested.buckets &&
      aggregateDataset.aggregations.firstHarvested.buckets.last365days
        ? aggregateDataset.aggregations.firstHarvested.buckets.last365days
            .doc_count
        : 0,

    withoutConcepts:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.subjectsCount &&
      aggregateDataset.aggregations.subjectCount.doc_count
        ? aggregateDataset.aggregations.subjectCount.doc_count
        : 0,
    distributions:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.distCount &&
      aggregateDataset.aggregations.distCount.doc_count
        ? aggregateDataset.aggregations.distCount.doc_count
        : 0,
    distOnPublicAccessCount:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.distOnPublicAccessCount &&
      aggregateDataset.aggregations.distOnPublicAccessCount.doc_count
        ? aggregateDataset.aggregations.distOnPublicAccessCount.doc_count
        : 0,
    subjectCount:
      aggregateDataset.aggregations &&
      aggregateDataset.aggregations.subjectCount &&
      aggregateDataset.aggregations.subjectCount.doc_count
        ? aggregateDataset.aggregations.subjectCount.doc_count
        : 0
  };
}

const mapProps = {
  stats: async props => {
    const query = props.orgPath || '';
    const response = await axios.get(`/aggregateDataset?q=${query}`);

    return extractStats(response.data);
  }
};

export const ResolvedReportStats = resolve(mapProps)(ReportStats);
