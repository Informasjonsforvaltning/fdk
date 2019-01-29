package no.fdk.webutils.aggregation;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.hateoas.PagedResources;

import java.util.Map;

public class PagedResourceWithAggregations<T> extends PagedResources<T> {
    private Map<String, Aggregation> aggregations;

    public PagedResourceWithAggregations(PagedResources<T> pagedResources, Map<String, Aggregation> aggregations) {
        super(pagedResources.getContent(), pagedResources.getMetadata());
        this.aggregations = aggregations;
    }

    @JsonProperty("aggregations")
    public Map<String, Aggregation> getAggregations() {
        return aggregations;
    }
}
