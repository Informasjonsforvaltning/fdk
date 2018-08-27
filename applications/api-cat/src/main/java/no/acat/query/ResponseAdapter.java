package no.acat.query;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.config.Utils;
import no.acat.model.ApiDocument;
import no.acat.model.QueryResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;

class ResponseAdapter {
    private static final Logger logger = LoggerFactory.getLogger(ResponseAdapter.class);

    ResponseAdapter() {

    }

    static QueryResponse convertFromElasticResponse(SearchResponse elasticResponse) {
        QueryResponse queryResponse = new QueryResponse();
        convertHits(queryResponse, elasticResponse);
        return queryResponse;
    }

    static void convertHits(QueryResponse queryResponse, SearchResponse elasticResponse) {
        ObjectMapper mapper = Utils.jsonMapper();

        queryResponse.setTotal(elasticResponse.getHits().getTotalHits());

        queryResponse.setHits(new ArrayList<>());
        for (SearchHit hit : elasticResponse.getHits().getHits()) {
            try {
                ApiDocument document = mapper.readValue(hit.getSourceAsString(), ApiDocument.class);
                queryResponse.getHits().add(document);
            } catch (Exception e) {
                logger.error("error {}", e.getMessage(), e);
            }
        }
    }
}
