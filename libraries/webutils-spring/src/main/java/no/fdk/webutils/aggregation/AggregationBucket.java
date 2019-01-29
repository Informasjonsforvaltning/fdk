package no.fdk.webutils.aggregation;

import lombok.Data;

@Data(staticConstructor = "of")
public class AggregationBucket {
    private final String key;
    private final long count;
}
