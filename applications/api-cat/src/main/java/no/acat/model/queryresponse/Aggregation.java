package no.acat.model.queryresponse;

import lombok.Data;

import java.util.List;

@Data
public class Aggregation {
    public List<AggregationBucket> buckets;
}
