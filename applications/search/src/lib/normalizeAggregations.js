import _ from 'lodash';

const normalizeBucketsArray = buckets =>
  buckets.map(bucket => ({
    key: bucket.key,
    count: bucket.doc_count || bucket.count // support passing through already normalized data
  }));

const normalizeBucketsObject = buckets =>
  Object.keys(buckets).map(key => ({
    key,
    count: buckets[key].doc_count || buckets[key].count // support passing through already normalized data
  }));

const normalizeAggregation = aggregation => {
  if (aggregation.doc_count || aggregation.value) {
    return { count: aggregation.doc_count || aggregation.value };
  }

  const { buckets } = aggregation;
  if (buckets && Array.isArray(buckets)) {
    return { buckets: normalizeBucketsArray(buckets) };
  }
  if (typeof buckets === 'object') {
    return { buckets: normalizeBucketsObject(buckets) };
  }
  return {};
};

export const normalizeAggregations = data => {
  const { aggregations } = data;
  if (aggregations) {
    return {
      ...data,
      aggregations: _.mapValues(aggregations, normalizeAggregation)
    };
  }
  return data;
};
