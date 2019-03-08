package no.fdk.webutils.aggregation;

import org.elasticsearch.search.aggregations.bucket.MultiBucketsAggregation;
import org.springframework.data.elasticsearch.core.aggregation.AggregatedPage;
import org.springframework.hateoas.PagedResources;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class ResponseUtil {

    public static <T> Map<String, Aggregation> extractAggregations(AggregatedPage<T> aggregatedPage) {
        Map<String, org.elasticsearch.search.aggregations.Aggregation> aggregationsElastic = aggregatedPage.getAggregations().getAsMap();
        final Map<String, Aggregation> aggregations = new HashMap<>();
        aggregationsElastic.forEach((aggregationName, elasticAggregation) -> {
            Aggregation outputAggregation = new Aggregation() {{
                buckets = new ArrayList<>();
            }};

            ((MultiBucketsAggregation) elasticAggregation).getBuckets().forEach((bucket) -> {
                outputAggregation.getBuckets().add(AggregationBucket.of(bucket.getKeyAsString(), bucket.getDocCount()));
            });
            aggregations.put(aggregationName, outputAggregation);
        });
        return aggregations;
    }

    public static <T> PagedResourceWithAggregations<T> addAggregations(PagedResources<T> conceptResources, AggregatedPage<T> aggregatedPage) {
        return new PagedResourceWithAggregations<>(conceptResources, extractAggregations(aggregatedPage));
    }
}
