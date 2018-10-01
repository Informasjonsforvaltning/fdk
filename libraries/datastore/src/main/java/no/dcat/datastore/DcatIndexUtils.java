package no.dcat.datastore;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import org.apache.commons.io.IOUtils;
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
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import java.io.InputStream;
import java.io.IOException;
import java.util.Map;


public class DcatIndexUtils {

    private static final String DCAT_INDEX_MAPPING_FILENAME = "dcat_dataset_mapping.json";
    private static final String DCAT_INDEX_SETTINGS_FILENAME = "dcat_settings.json";
    private static final String CLUSTER_NAME = "cluster.name";
    private final Logger logger = LoggerFactory.getLogger(DcatIndexUtils.class);

    private Elasticsearch5Client esClient;


    public DcatIndexUtils(final Elasticsearch5Client esClient) {
        this.esClient = esClient;
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
        Object a = esClient.getClient();
        Object b = esClient.getClient().admin();
        Object c = esClient.getClient().admin().indices();
        Object d = esClient.getClient().admin().indices().prepareExists(index);
        return esClient.getClient().admin().indices().prepareExists(index).execute().actionGet().isExists();
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
            logger.error("XXXType {} does not exist",type);
        }

        return false;
    }

    /**
     * Creates new dcat and theme indexes on Elasticsearch cluster
     * The indexes are set up correct indexing fields and language stemming
     * Configuration of the indexes is specified in DCAT_INDEX_MAPPING_FILENAME
     *
     * @param index Name of index to be created
     */
    public void createIndex(String index) {
        //Set mapping for correct language stemming and indexing
        if (index != null) {
            if (index.equals("harvest")) {
                Resource harvestCatalogResource = new ClassPathResource("harvest_catalog_mapping.json");
                Resource harvestDatasetResource = new ClassPathResource("harvest_dataset_mapping.json");
                Resource harvestLookupResource = new ClassPathResource("harvest_lookup_mapping.json");
                Resource settingsResource = new ClassPathResource(DCAT_INDEX_SETTINGS_FILENAME);
                try {
                    esClient.getClient().admin().indices().prepareCreate("harvest")
                            .setSettings(IOUtils.toString(settingsResource.getInputStream(),"UTF-8"))
                            .addMapping("catalog", IOUtils.toString(harvestCatalogResource.getInputStream(), "UTF-8"))
                            .addMapping("dataset", IOUtils.toString(harvestDatasetResource.getInputStream(), "UTF-8"))
                            .addMapping("lookup", IOUtils.toString(harvestLookupResource.getInputStream(), "UTF-8"))
                            .execute().actionGet();

                    logger.debug("[createIndex] {}", "harvest");
                    esClient.getClient().admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();

                } catch (IOException e) {
                    logger.error("Unable to create index for {}. Reason {}", index, e.getLocalizedMessage());
                }
            } else if (index.equals("dcat")) {

                PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
                try {
                    Resource dcatSettingsResource = new ClassPathResource(DCAT_INDEX_SETTINGS_FILENAME);
                    Resource datasetMappingResource = new ClassPathResource(DCAT_INDEX_MAPPING_FILENAME);

                    esClient.getClient().admin().indices().prepareCreate(index)
                            .setSettings(IOUtils.toString(dcatSettingsResource.getInputStream(), "UTF-8"))
                            .addMapping("dataset", IOUtils.toString(datasetMappingResource.getInputStream(), "UTF-8"))
                            .execute().actionGet();

                    logger.debug("[createIndex] {}", index);
                    esClient.getClient().admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();

                } catch (IOException e) {
                    logger.error("Unable to create index [{}] in Elasticsearch. Reason {} ", index, e.getMessage());
                }
            } else if (index.equals("scat")) {
                try {
                    Resource dcatSettingsResource = new ClassPathResource(DCAT_INDEX_SETTINGS_FILENAME);
                    Resource subjectMappingResource = new ClassPathResource("scat_subject_mapping.json");

                    esClient.getClient().admin().indices().prepareCreate(index)
                            .setSettings(IOUtils.toString(dcatSettingsResource.getInputStream(), "UTF-8"))
                            .addMapping("subject", IOUtils.toString(subjectMappingResource.getInputStream(), "UTF-8"))
                            .execute().actionGet();

                    logger.debug("[createIndex] {}", index);
                    esClient.getClient().admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();
                } catch (IOException e) {
                    logger.error("Unable to create index [{}] in Elasticsearch. Reason {} ", index, e.getMessage());
                }
            }
        }
    }

    private void createElasticsearchIndex(String index) throws IOException {
        esClient.getClient().admin().indices().prepareCreate(index).execute().actionGet();
        logger.debug("[createIndex] {}", index);
        esClient.getClient().admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();
        logger.debug("[createIndex] after prepareHealth");
    }

    private void createMapping(String index, String type, InputStream is) throws IOException {
        String mappingJson = IOUtils.toString(is, "UTF-8");

        esClient.getClient().admin().indices().preparePutMapping(index).setType(type).setSource(mappingJson).execute().actionGet();
        logger.info("Create mapping {}/{}. Mapping file contains {} characters", index, type, mappingJson.length());
        esClient.getClient().admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();
    }


    private void createSettings(String index, InputStream is) throws IOException {
        String settingsJson = IOUtils.toString(is, "UTF-8");
        esClient.getClient().admin().indices().prepareUpdateSettings(index).setSettings(settingsJson).execute().actionGet();
        logger.debug("[createIndex] after prepareUpdateSettings");
        esClient.getClient().admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();
        logger.debug("[createIndex] after prepareHealth");
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

        if(!indexExists(index)) {
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
