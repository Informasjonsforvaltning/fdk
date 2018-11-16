package no.acat.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.model.ApiDocument;
import no.acat.service.ElasticsearchService;
import org.elasticsearch.action.get.GetResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

/*
ApiDocumentRepository is a Repository abstraction over elasticsearch storage implementation
TODO - use spring data elasticsearch instead.
 */
@Service
public class ApiDocumentRepository {
    private ElasticsearchService elasticsearchService;
    private ObjectMapper mapper;

    @Autowired
    public ApiDocumentRepository(ElasticsearchService elasticsearchService, ObjectMapper mapper) {
        this.elasticsearchService = elasticsearchService;
        this.mapper = mapper;
    }

    public Optional<ApiDocument> getById(String id) throws IOException {

        GetResponse getResponse = elasticsearchService.getClient().prepareGet("acat", "apidocument", id).get();

        ApiDocument apiDocument = getResponse.isExists() ? mapper.readValue(getResponse.getSourceAsString(), ApiDocument.class) : null;
        return Optional.ofNullable(apiDocument);
    }
}
