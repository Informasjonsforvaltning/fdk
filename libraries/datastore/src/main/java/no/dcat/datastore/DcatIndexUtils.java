package no.dcat.datastore;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.commons.io.IOUtils;
import org.elasticsearch.action.ActionRequestValidationException;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.cluster.health.ClusterHealthStatus;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Represents connection to Elasticsearch instance
 */
public class DcatIndexUtils implements AutoCloseable {

    private static final String DCAT_INDEX_MAPPING_FILENAME = "dcat_dataset_mapping.json";
    private static final String DCAT_INDEX_SETTINGS_FILENAME = "dcat_settings.json";
    private static final String CLUSTER_NAME = "cluster.name";
    private final Logger logger = LoggerFactory.getLogger(DcatIndexUtils.class);

    private Client client;


    public static class ElasticsearchNode {
        public String host;
        public int port;
    }

    /**
     * Creates connection to a particular elasticsearch cluster
     *
     * @param clusterNodes Comma-separated list og <IP address or hostname>:port where cluster can be reached
     * @param clusterName Name of cluster. Default is "elasticsearch"
     */
    public DcatIndexUtils(String clusterNodes, String clusterName) {
        logger.debug("Attempt to connect to Elasticsearch clients: " + clusterNodes + " cluster: " + clusterName);
        this.client = returnElasticsearchTransportClient(clusterNodes, clusterName);
        logger.debug("transportclient success ...? " + this.client);
    }


    /**
     * Set elastic search transport client
     *
     * @param client An elasticsearch transport client
     */
    public DcatIndexUtils(Client client) {
        this.client = client;
    }


    public static List<ElasticsearchNode> parseHostsString(final String hosts) {
        List<ElasticsearchNode> nodes = new ArrayList<>();
        for (String nodeString : hosts.split(",")) {
            if (nodeString.trim().isEmpty()) {
                continue;
            }

            String[] parts = nodeString.split(":");
            if (parts.length==0 || parts[0].trim().isEmpty()) {
                continue;
            }

            ElasticsearchNode node = new ElasticsearchNode();
            node.host = parts[0].trim();
            node.port = (parts.length <= 1) ? 9300 : Integer.parseInt(parts[1].trim());

            nodes.add(node);
        }

        return nodes;
    }

    /**
     * Creates elasticsearch transport client and returns it to caller
     *
     * @param clusterNodes Comma-separated list og <IP address or hostname>:port where cluster can be reached
     * @param clusterName Name of cluster. Default is "elasticsearch"
     * @return elasticsearch transport client bound to hostname, port and cluster specified in input parameters
     */
    public Client returnElasticsearchTransportClient(String clusterNodes, String clusterName) {
        PreBuiltTransportClient client = null;
        try {
            logger.debug("Connect to elasticsearch clients: " + clusterNodes + " cluster: " + clusterName);
            List<ElasticsearchNode> nodes = parseHostsString(clusterNodes);

            Settings settings = Settings.builder()
                    .put(CLUSTER_NAME, clusterName)
                    .build();

            client = new PreBuiltTransportClient(settings); //.addTransportAddress(address);

            for (ElasticsearchNode node : nodes) {
                InetAddress inetaddress = InetAddress.getByName(node.host);
                logger.debug("ES inetddress: " + inetaddress.toString());
                InetSocketTransportAddress address = new InetSocketTransportAddress(inetaddress, node.port);
                logger.debug("ES address: " + address.toString());

                client.addTransportAddress(address);
            }
        } catch (UnknownHostException e) {
            logger.error(e.toString());
        }

        logger.debug("transportclient: " + client);
        return client;
    }

    /**
     * Check to see if Elasticsearch cluster is answering
     *
     * @return True if cluster is running
     */
    public boolean isElasticsearchRunning() {
        return client != null && elasticsearchStatus() != null ;
    }


    /**
     * Return status of Elasticsearch cluster. status can be either GREEN, YELLOW or RED.
     *
     * @return one value of ClusterHealthStatus enumeration: GREEN, YELLOW or RED
     */
    public ClusterHealthStatus elasticsearchStatus() {
        return client.admin().cluster().prepareHealth().execute().actionGet().getStatus();
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
        return client.prepareGet(index, type, id).execute().actionGet().isExists();
    }


    /**
     * Checks if a particular index exists on elasticsearch cluster
     *
     * @param index name of index. Example "dcat"
     * @return True if index exists
     */
    public boolean indexExists(String index) {
        return client.admin().indices().prepareExists(index).execute().actionGet().isExists();
    }

    /**
     * Checks if a particular type exists on elasticsearch cluster
     *
     * @param type name of type.
     * @return True if index exists
     */
    public boolean typeExists(String type) {
        try {
            return client.admin().indices().prepareTypesExists(type).execute().actionGet().isExists();
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
                    client.admin().indices().prepareCreate("harvest")
                            .setSettings(IOUtils.toString(settingsResource.getInputStream(),"UTF-8"))
                            .addMapping("catalog", IOUtils.toString(harvestCatalogResource.getInputStream(), "UTF-8"))
                            .addMapping("dataset", IOUtils.toString(harvestDatasetResource.getInputStream(), "UTF-8"))
                            .addMapping("lookup", IOUtils.toString(harvestLookupResource.getInputStream(), "UTF-8"))
                            .execute().actionGet();

                    logger.debug("[createIndex] {}", "harvest");
                    client.admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();

                } catch (IOException e) {
                    logger.error("Unable to create index for {}. Reason {}", index, e.getLocalizedMessage());
                }
            } else if (index.equals("dcat")) {

                PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
                try {
                    Resource dcatSettingsResource = new ClassPathResource(DCAT_INDEX_SETTINGS_FILENAME);
                    Resource datasetMappingResource = new ClassPathResource(DCAT_INDEX_MAPPING_FILENAME);

                    client.admin().indices().prepareCreate(index)
                            .setSettings(IOUtils.toString(dcatSettingsResource.getInputStream(), "UTF-8"))
                            .addMapping("dataset", IOUtils.toString(datasetMappingResource.getInputStream(), "UTF-8"))
                            .execute().actionGet();

                    logger.debug("[createIndex] {}", index);
                    client.admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();

                } catch (IOException e) {
                    logger.error("Unable to create index [{}] in Elasticsearch. Reason {} ", index, e.getMessage());
                }
            } else if (index.equals("scat")) {
                try {
                    Resource dcatSettingsResource = new ClassPathResource(DCAT_INDEX_SETTINGS_FILENAME);
                    Resource subjectMappingResource = new ClassPathResource("scat_subject_mapping.json");

                    client.admin().indices().prepareCreate(index)
                            .setSettings(IOUtils.toString(dcatSettingsResource.getInputStream(), "UTF-8"))
                            .addMapping("subject", IOUtils.toString(subjectMappingResource.getInputStream(), "UTF-8"))
                            .execute().actionGet();

                    logger.debug("[createIndex] {}", index);
                    client.admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();
                } catch (IOException e) {
                    logger.error("Unable to create index [{}] in Elasticsearch. Reason {} ", index, e.getMessage());
                }
            }
        }
    }

    private void createElasticsearchIndex(String index) throws IOException {
        client.admin().indices().prepareCreate(index).execute().actionGet();
        logger.debug("[createIndex] {}", index);
        client.admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();
        logger.debug("[createIndex] after prepareHealth");
    }

    private void createMapping(String index, String type, InputStream is) throws IOException {
        String mappingJson = IOUtils.toString(is, "UTF-8");

        client.admin().indices().preparePutMapping(index).setType(type).setSource(mappingJson).execute().actionGet();
        logger.info("Create mapping {}/{}. Mapping file contains {} characters", index, type, mappingJson.length());
        client.admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();
    }


    private void createSettings(String index, InputStream is) throws IOException {
        String settingsJson = IOUtils.toString(is, "UTF-8");
        client.admin().indices().prepareUpdateSettings(index).setSettings(settingsJson).execute().actionGet();
        logger.debug("[createIndex] after prepareUpdateSettings");
        client.admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();
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
        IndexResponse rsp = client.prepareIndex(index, type, id).setSource(jsonObject).execute().actionGet();
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
        IndexResponse rsp = client.prepareIndex(index, type, id).setSource(jsonArray).execute().actionGet();
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
        IndexResponse rsp = client.prepareIndex(index, type, id).setSource(string).execute().actionGet();
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
        IndexResponse rsp = client.prepareIndex(index, type, id).setSource(map).execute().actionGet();
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
        DeleteResponse rsp = client.prepareDelete(index, type, id).execute().actionGet();
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

        SearchResponse sr = this.getClient().prepareSearch(index).setTypes(type).
                setQuery(QueryBuilders.matchAllQuery()).setSize(size).get();

        if (sr.getHits().getHits().length == 0) {
            return false;
        }

        for (SearchHit s : sr.getHits().getHits()) {
            this.getClient().prepareDelete(index, type, s.getId()).get();
        }
        return true;
    }


    /**
     * Close connection to Elasticsearch cluster
     */
    public void close() {
        client.close();
    }

    /**
     * Get Elasticsearc transport client instance
     *
     * @return Elasticsearch transport client
     */
    public Client getClient() {
        return client;
    }
}
