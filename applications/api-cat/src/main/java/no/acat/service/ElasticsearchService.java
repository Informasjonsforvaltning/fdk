package no.acat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.acat.model.ApiDocument;
import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ElasticsearchService {
    private static Logger logger = LoggerFactory.getLogger(ElasticsearchService.class);

    @Value("${elastic.clusterNodes}")
    private String clusterNodes;

    @Value("${elastic.clusterName}")
    private String clusterName;
    private Elasticsearch5Client elasticsearch;

    private ObjectMapper mapper;

    @Autowired
    public ElasticsearchService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    void setElasticserchCluster(String clusterNodes, String clusterName) {
        assert clusterNodes != null;
        assert clusterName != null;

        this.clusterNodes = clusterNodes;
        this.clusterName = clusterName;

        initializeElasticsearchTransportClient();
        try {
            getElasticsearchClient().registerSetting("acat", mapper.readTree(new ClassPathResource("acat.settings.json").getInputStream()).toString());
            getElasticsearchClient().registerMapping("acat", "apidocument", mapper.readTree(new ClassPathResource("apidocument.mapping.json").getInputStream()).get("apidocument").toString());

            getElasticsearchClient().initializeAliasAndIndexMapping("acat");

        } catch (IOException e) {
            logger.error("Unable to initialize index, mapping and alias", e);
        }

    }


    public Elasticsearch5Client getElasticsearchClient() {
        return elasticsearch;
    }

    public Client getClient() {
        if (elasticsearch == null) {
            initializeElasticsearchTransportClient();
        }
        return elasticsearch == null ? null : elasticsearch.getClient();
    }

    private void initializeElasticsearchTransportClient() {
        logger.debug("elasticsearch: " + clusterNodes);
        if (elasticsearch == null) {
            if (clusterNodes == null) {
                logger.error("Configuration property elastic.clusterNodes is not initialized. Unable to connect to Elasticsearch");
            }

            elasticsearch = new Elasticsearch5Client(clusterNodes, clusterName);
        }
    }


    public void createOrReplaceApiDocument(ApiDocument document) throws IOException {
        BulkRequestBuilder bulkRequest = getClient().prepareBulk();
        String id = document.getId();

        IndexRequest request = new IndexRequest("acat", "apidocument", id);
        String json = mapper.writeValueAsString(document);
        logger.trace("Indexing document source: {}", json);

        request.source(json, XContentType.JSON);
        bulkRequest.add(request);

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            final String msg = String.format("Failed index of %s. Reason %s", id, bulkResponse.buildFailureMessage());
            throw new RuntimeException(msg);
        }

        logger.info("ApiDocument is indexed. id={}, harvestSourceUri={}", document.getId(), document.getHarvestSourceUri());
    }

    public void deleteApiDocumentByIds(List<String> ids) {
        if (ids.size() == 0) {
            logger.debug("ApiDocuments deleted. count:0");
            return;
        }

        BulkRequestBuilder bulkRequest = getClient().prepareBulk();

        for (String id : ids) {
            DeleteRequest request = new DeleteRequest("acat", "apidocument", id);
            bulkRequest.add(request);
        }

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            final String msg = String.format("Failed delete. Reason %s", bulkResponse.buildFailureMessage());
            throw new RuntimeException(msg);
        }

        logger.debug("ApiDocuments deleted. count:{}", ids.size());
    }

    public List<String> getApiDocumentIdsNotHarvested(List<String> ids) {
        logger.debug("harvested ids {}", ids);

        String[] idsArray = ids.toArray(new String[0]);
        QueryBuilder harvestedQuery = QueryBuilders.idsQuery("apidocument").addIds(idsArray);
        logger.trace("getApiDocumentIdsNotHarvested elastic harvestedquery {}", harvestedQuery.toString());

        QueryBuilder notHarvestedQuery = QueryBuilders.boolQuery().mustNot(harvestedQuery);
        logger.trace("getApiDocumentIdsNotHarvested elastic query {}", notHarvestedQuery.toString());

        SearchResponse response = getClient().prepareSearch("acat")
            .setTypes("apidocument")
            .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
            .setQuery(notHarvestedQuery)
            .setFetchSource(new String[]{"id", "harvest.lastHarvested"}, null)
            .get();
        logger.trace("response {}", response);

        SearchHit[] hits = response.getHits().getHits();
        List<String> idsNotHarvested = Arrays.stream(hits).map(SearchHit::getId).collect(Collectors.toList());

        logger.debug("Ids not harvested {}", idsNotHarvested);

        return idsNotHarvested;
    }

}
