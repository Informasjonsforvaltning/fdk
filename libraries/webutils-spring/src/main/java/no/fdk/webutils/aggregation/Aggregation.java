package no.fdk.webutils.aggregation;

import lombok.Data;

import java.util.List;

@Data
public class Aggregation {
    public List<AggregationBucket> buckets;
}
