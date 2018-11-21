package no.dcat.datastore;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import org.elasticsearch.action.ActionRequestValidationException;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.Map;


public class DcatIndexUtils {

    private final Logger logger = LoggerFactory.getLogger(DcatIndexUtils.class);

    private Elasticsearch5Client esClient;

    public DcatIndexUtils(final Elasticsearch5Client esClient) {

        this.esClient = esClient;

        try {

            initializeAliasesAndMappings();

        } catch (IOException e) {
            throw new RuntimeException("Unable to initialize dcat alias and index");
        }

    }

    public void initializeAliasesAndMappings() throws IOException {
        ObjectMapper mapper = new ObjectMapper();

        esClient.registerSetting("dcat", mapper.readTree(new ClassPathResource("dcat_settings.json").getInputStream()).toString());
        esClient.registerMapping("dcat", "dataset", mapper.readTree(new ClassPathResource("dcat_dataset_mapping.json").getInputStream()).get("dataset").toString());

        esClient.initializeAliasAndIndexMapping("dcat");

        esClient.registerSetting("harvest", mapper.readTree(new ClassPathResource("dcat_settings.json").getInputStream()).toString());
        esClient.registerMapping("harvest", "catalog", mapper.readTree(new ClassPathResource("harvest_catalog_mapping.json").getInputStream()).get("catalog").toString());
        esClient.registerMapping("harvest", "dataset", mapper.readTree(new ClassPathResource("harvest_dataset_mapping.json").getInputStream()).get("dataset").toString());
        esClient.registerMapping("harvest", "lookup", mapper.readTree(new ClassPathResource("harvest_lookup_mapping.json").getInputStream()).get("lookup").toString());

        esClient.initializeAliasAndIndexMapping("harvest");

    }

    /**
     * Checks if a particular document exists in elasticsearch index
     *
     * @param index name of index. Example "dcat"
     * @param type  Docuyment type. Example: "dataset"
     * @param id    ID of document
     * @return True if document exists
     */
    public boolean documentExists(String index, String type, String id) {
        return esClient.getClient().prepareGet(index, type, id).execute().actionGet().isExists();
    }


    /**
     * Checks if a particular index exists on elasticsearch cluster
     *
     * @param index name of index. Example "dcat"
     * @return True if index exists
     */
    public boolean indexExists(String index) {

        return esClient.indexExists(index);
    }

    /**
     * Checks if a particular type exists on elasticsearch cluster
     *
     * @param type name of type.
     * @return True if index exists
     */
    public boolean typeExists(String type) {
        try {
            return esClient.getClient().admin().indices().prepareTypesExists(type).execute().actionGet().isExists();
        } catch (ActionRequestValidationException e) {
            logger.error("XXXType {} does not exist", type);
        }

        return false;
    }

    /**
     * Puts a new Json document into specified index
     *
     * @param index      Index where json document is stored
     * @param type       Document type to be stored. Example: "dataset"
     * @param id         ID of document to be stored
     * @param jsonObject The Json object to representing the object to be stored
     * @return True if successful
     */
    public boolean indexDocument(String index, String type, String id, JsonObject jsonObject) {
        IndexResponse rsp = esClient.getClient().prepareIndex(index, type, id).setSource(jsonObject).execute().actionGet();
        return rsp.getResult() == DocWriteResponse.Result.CREATED;
    }


    /**
     * Puts a new Json array into index as a document
     *
     * @param index     Index where json array is stored
     * @param type      Document type to be stored. Example: "dataset"
     * @param id        ID of document to be stored
     * @param jsonArray Json array to be stored
     * @return True if successful
     */
    public boolean indexDocument(String index, String type, String id, JsonArray jsonArray) {
        IndexResponse rsp = esClient.getClient().prepareIndex(index, type, id).setSource(jsonArray).execute().actionGet();
        return rsp.getResult() == DocWriteResponse.Result.CREATED;
    }


    /**
     * Puts a new string object into index as a document
     *
     * @param index  Index where the string is to be stored
     * @param type   Document type to be stored. Example: "dataset"
     * @param id     ID of document to be stored
     * @param string String representing the contents of the document that is to be stored
     * @return True if successful
     */
    public boolean indexDocument(String index, String type, String id, String string) {
        IndexResponse rsp = esClient.getClient().prepareIndex(index, type, id).setSource(string).execute().actionGet();
        return rsp.getResult() == DocWriteResponse.Result.CREATED;
    }


    /**
     * Puts a new object map into index as document
     *
     * @param index Index where the oject map is to be stored
     * @param type  Document type to be stored. Example: "dataset"
     * @param id    ID of document to be stored
     * @param map   Object map to be stored
     * @return True if successful
     */
    public boolean indexDocument(String index, String type, String id, Map<String, Object> map) {
        IndexResponse rsp = esClient.getClient().prepareIndex(index, type, id).setSource(map).execute().actionGet();
        return rsp.getResult() == DocWriteResponse.Result.CREATED;
    }


    /**
     * Delete document from Elasticsearch index
     *
     * @param index Name of index where the document to be deleted is stored
     * @param type  Type of document to be deleted
     * @param id    ID of document to be deleted
     * @return True if successful
     */
    public boolean deleteDocument(String index, String type, String id) {
        DeleteResponse rsp = esClient.getClient().prepareDelete(index, type, id).execute().actionGet();
        return rsp.getResult() != DocWriteResponse.Result.DELETED;
    }

    /**
     * Delete all documents from Elasticsearch index and type
     *
     * @param index Name of index where the type to be deleted is stored
     * @param type  Type of document to be deleted
     * @param size  Maximum number of document to be deleted
     * @return True if documents has been successfully deleted.
     */
    public boolean deleteAllDocumentsInType(String index, String type, int size) {

        if (!indexExists(index)) {
            return false;
        }

        SearchResponse sr = esClient.getClient().prepareSearch(index).setTypes(type).
            setQuery(QueryBuilders.matchAllQuery()).setSize(size).get();

        if (sr.getHits().getHits().length == 0) {
            return false;
        }

        for (SearchHit s : sr.getHits().getHits()) {
            esClient.getClient().prepareDelete(index, type, s.getId()).get();
        }
        return true;
    }

}
