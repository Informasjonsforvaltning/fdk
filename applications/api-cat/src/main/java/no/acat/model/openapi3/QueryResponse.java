package no.acat.model.openapi3;

import lombok.Data;
import no.acat.model.ApiDocument;

import java.util.List;

@Data
public class QueryResponse {

    long total;
    List<ApiDocument> hits;
}
