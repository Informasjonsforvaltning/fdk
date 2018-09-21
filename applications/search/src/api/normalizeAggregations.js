const normalizeAggregation = aggregation => {
  const { buckets } = aggregation;
  const docCount = aggregation.doc_count;
  if (buckets && Array.isArray(buckets)) {
    const normalizedBuckets = [];
    buckets.forEach(bucket => {
      const normalizedBucket = {
        ...bucket,
        count: bucket.doc_count
      };
      delete normalizedBucket.doc_count;
      normalizedBuckets.push(normalizedBucket);
    });
    return { buckets: normalizedBuckets };
  } else if(typeof buckets === "object") {
    const normalizedBuckets = [];
    for (var k in buckets) {
        if (buckets.hasOwnProperty(k)) {
            const normalizedBucket = {};
            normalizedBucket[k] = buckets[k].doc_count;
            delete normalizedBucket.doc_count;
            normalizedBuckets.push(normalizedBucket);
        }
    }
    return { buckets: normalizedBuckets }
  } else if (docCount) {
    return {
      count: docCount
    };
  }
  return {};
};

export const normalizeAggregations = data => {
  const { aggregations } = data;
  if (aggregations) {
    const normalizedAggregations = {};
    Object.keys(aggregations).forEach(aggregation => {
      const currentAggregation = aggregations[aggregation];
      normalizedAggregations[aggregation] = normalizeAggregation(
        currentAggregation
      );
    });
    return {
      ...data,
      aggregations: normalizedAggregations
    };
  }
  return data;
};
