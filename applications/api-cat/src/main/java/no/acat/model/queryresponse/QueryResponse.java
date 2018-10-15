package no.acat.model.queryresponse;

import lombok.Data;
import no.acat.model.ApiDocument;

import java.util.List;
import java.util.Map;

@Data
public class QueryResponse {

    long total;
    List<ApiDocument> hits;
    Map<String, Aggregation> aggregations;
}
