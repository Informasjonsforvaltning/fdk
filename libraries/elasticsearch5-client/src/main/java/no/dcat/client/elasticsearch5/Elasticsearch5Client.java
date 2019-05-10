package no.dcat.client.elasticsearch5;

import com.carrotsearch.hppc.cursors.ObjectCursor;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.diff.JsonDiff;
import org.elasticsearch.action.admin.indices.create.CreateIndexRequestBuilder;
import org.elasticsearch.action.admin.indices.mapping.get.GetMappingsRequest;
import org.elasticsearch.client.Client;
import org.elasticsearch.cluster.health.ClusterHealthStatus;
import org.elasticsearch.cluster.metadata.MappingMetaData;
import org.elasticsearch.common.collect.ImmutableOpenMap;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.reindex.BulkByScrollResponse;
import org.elasticsearch.index.reindex.ReindexAction;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.*;


public class Elasticsearch5Client implements AutoCloseable {

    private static final String CLUSTER_NAME = "cluster.name";
    private final Logger logger = LoggerFactory.getLogger(Elasticsearch5Client.class);

    private Client client;

    private Map<String, SettingsAndMappingRecord> aliasMetadata = new HashMap<>();

    /**
     * Creates connection to a particular elasticsearch cluster
     *
     * @param clusterNodes Comma-separated list og <IP address or hostname>:port where cluster can be reached
     * @param clusterName  Name of cluster. Default is "elasticsearch"
     */
    public Elasticsearch5Client(String clusterNodes, String clusterName) {
        logger.debug("Attempt to connect to Elasticsearch clients: " + clusterNodes + " cluster: " + clusterName);
        this.client = returnElasticsearchTransportClient(clusterNodes, clusterName);
        logger.debug("transportclient success ...? " + this.client);
    }

    /**
     * Set elastic search transport client
     *
     * @param client An elasticsearch transport client
     */
    public Elasticsearch5Client(Client client) {
        this.client = client;
    }

    static List<ElasticsearchNode> parseHostsString(final String hosts) {
        List<ElasticsearchNode> nodes = new ArrayList<>();
        for (String nodeString : hosts.split(",")) {
            if (nodeString.trim().isEmpty()) {
                continue;
            }

            String[] parts = nodeString.split(":");
            if (parts.length == 0 || parts[0].trim().isEmpty()) {
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
     * @param clusterName  Name of cluster. Default is "elasticsearch"
     * @return elasticsearch transport client bound to hostname, port and cluster specified in input parameters
     */
    Client returnElasticsearchTransportClient(String clusterNodes, String clusterName) {
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
        return client != null && elasticsearchStatus() != null;
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

    public boolean indexExists(String index) {
        return getClient().admin().indices().prepareExists(index).execute().actionGet().isExists();
    }

    public boolean aliasExists(String alias) {
        return getClient().admin().indices().prepareAliasesExist(alias).execute().actionGet().isExists();
    }

    public String getIndexForAlias(String alias) {
        return getClient().admin().indices().prepareGetAliases(alias).get().getAliases().keysIt().next();
    }

    public void deleteIndex(String indexName) {
        if (indexExists(indexName)) {
            getClient().admin().indices().prepareDelete(indexName).get();
        }
    }

    String incrementIndexName(String indexName) {
        String number = indexName.replaceAll("[^0-9]+", "");
        if (number.isEmpty()) {
            number = "0";
        }

        String versionString = "v" + (Integer.parseInt(number) + 1);
        String indexRoot = indexName.replaceAll("_v[0-9]*", "");

        return indexRoot + "_" + versionString;
    }

    void reindex(String fromIndex, String toIndex) {

        if (indexExists(fromIndex)) {
            logger.info("Start reindexing of {} -> {}", fromIndex, toIndex);

            BulkByScrollResponse response = ReindexAction.INSTANCE.newRequestBuilder(getClient())
                .destination(toIndex)
                .source(fromIndex)
                .get();

            logger.info("Reindex finished. Response: {}", response.toString());
        }
    }

    void swithchAlias(String aliasName, String oldIndexName, String newIndexName) {

        if (oldIndexName != null) {
            getClient().admin().indices().prepareAliases().removeAlias(oldIndexName, aliasName).get();
        }

        getClient().admin().indices().prepareAliases().addAlias(newIndexName, aliasName).get();
    }

    public void registerSetting(String alias, String settings) {
        SettingsAndMappingRecord record = getSettingsAndMappingRecord(alias);

        record.indexSettings = settings;
    }

    public void registerMapping(String alias, String type, String mapping) {
        SettingsAndMappingRecord record = getSettingsAndMappingRecord(alias);
        if (record.typeMapping == null) {
            record.typeMapping = new HashMap<>();
        }
        record.typeMapping.put(type, mapping);
    }

    SettingsAndMappingRecord getSettingsAndMappingRecord(String alias) {
        SettingsAndMappingRecord record = aliasMetadata.get(alias);

        if (record == null) {
            record = new SettingsAndMappingRecord();
            aliasMetadata.put(alias, record);
        }
        return record;
    }

    public void initializeAliasAndIndexMapping(String alias) throws IOException {
        logger.debug("Initializing elastic5 client for alias {}", alias);

        if (!aliasExists(alias)) {
            logger.debug("Alias {} did not exist - creating for the first time");
            // this will be run first time to create the first index and its alias
            String newIndexName = incrementIndexName(alias);
            createIndexIfNotExists(alias, newIndexName);
            reindex(alias, newIndexName);
            deleteIndex(alias);
            swithchAlias(alias, null, newIndexName);
            logger.debug("Alias {} created for the first time", alias);
            return;
        }

        String currentIndexName = getIndexForAlias(alias);

        if (indexExists(currentIndexName)) {
            logger.debug("Alias {} exist, checking mapping", alias);

            if (!isMappingOK(alias, currentIndexName)) {
                logger.debug("Alias {} mapping not ok, re-indexing ", alias);
                // mapping is not OK therefore reindex
                String newIndexName = incrementIndexName(currentIndexName);

                createIndexIfNotExists(alias, newIndexName);
                reindex(currentIndexName, newIndexName);
                swithchAlias(alias, currentIndexName, newIndexName);
                deleteIndex(currentIndexName);
                logger.info("Index mapping updated successfully: {}", currentIndexName);
            }
        } else {
            logger.error("Index {} does not exist. Bailing out", currentIndexName);
            throw new IOException("Unable to initialize index " + currentIndexName);
        }
    }

    boolean isMappingOK(String alias, String index) throws IOException {

        ImmutableOpenMap<String, MappingMetaData> currentMapping = getCurrentMapping(index);
        ObjectMapper mapper = new ObjectMapper();
        Set<String> currentMappedTypes = new HashSet<>();

        for (ObjectCursor<String> typeName : currentMapping.keys()) {

            currentMappedTypes.add(typeName.value);

            JsonNode currentTypeMapping = mapper.valueToTree(currentMapping.get(typeName.value).getSourceAsMap())
                .get("properties");

            String mapping = aliasMetadata.get(alias).typeMapping.get(typeName.value);
            if (mapping != null) {
                JsonNode targetTypeMapping = mapper.readTree(mapping).get("properties");

                if (!checkNodes(currentTypeMapping, targetTypeMapping)) {
                    logger.warn("Mapping for type {} is not OK!", typeName.value);
                    return false;
                }
            }

            logger.debug("Mapping for type {} is OK", typeName.value);
        }

        for (String type : aliasMetadata.get(alias).typeMapping.keySet()) {
            if (!currentMappedTypes.contains(type)) {
                logger.warn("Maping for type {} is missing in current index", type);
                return false;
            }
        }

        return true;
    }

    ImmutableOpenMap<String, MappingMetaData> getCurrentMapping(String index) {
        GetMappingsRequest mappingsRequest = new GetMappingsRequest();
        mappingsRequest.indices(index);

        return getClient().admin().indices().getMappings(mappingsRequest).actionGet().mappings().get(index);
    }

    void logDifference(String propertyName, JsonNode current, JsonNode target) {
        logger.warn("property: {} has inconsistent mapping", propertyName);
        logger.warn("elasticMapping: {}", current != null ? current.toString() : null);
        logger.warn("targetMapping : {}", target != null ? target.toString() : null);
    }

    boolean checkNodes(JsonNode currentTypeMapping, JsonNode targetTypeMapping) {
        Iterator<String> iter = targetTypeMapping.fieldNames();
        while (iter.hasNext()) {
            String propertyName = iter.next();

            JsonNode targetPropertyNode = targetTypeMapping.get(propertyName);
            JsonNode currentPropertyNode = currentTypeMapping.get(propertyName);

            if (currentPropertyNode == null) {
                logDifference(propertyName, currentPropertyNode, targetPropertyNode);
                return false;
            }

            if (targetPropertyNode.has("properties")) {
                if (checkNodes(currentPropertyNode.get("properties"), targetPropertyNode.get("properties"))) {
                    continue;
                } else {
                    logDifference(propertyName, currentPropertyNode, targetPropertyNode);
                    return false;
                }
            }

            JsonNode patch = JsonDiff.asJson(currentPropertyNode, targetPropertyNode);

            if (patch.size() > 0) {
                logger.info("patch: {}", patch.toString());
                logDifference(propertyName, currentPropertyNode, targetPropertyNode);
                return false;
            }
        }
        return true;
    }

    void createIndexIfNotExists(String alias, String indexName) {
        if (indexExists(indexName)) {
            logger.info("Index exists: " + indexName);
            return;
        }

        logger.info("Creating index: {} for alias {} ", indexName, alias);

        CreateIndexRequestBuilder createIndexRequestBuilder = getClient().admin().indices().prepareCreate(indexName);

        String indexSettings = aliasMetadata.get(alias).indexSettings;
        if (indexSettings != null && !indexSettings.isEmpty()) {
            createIndexRequestBuilder.setSettings(indexSettings, XContentType.JSON);
        }

        aliasMetadata.get(alias).typeMapping.forEach((type, mapping) -> {
            if (type != null && mapping != null && !mapping.isEmpty()) {
                createIndexRequestBuilder.addMapping(type, mapping, XContentType.JSON);
            }
        });

        createIndexRequestBuilder.execute().actionGet();

    }

    public static class ElasticsearchNode {
        public String host;
        public int port;
    }

    private class SettingsAndMappingRecord {
        String indexSettings;
        Map<String, String> typeMapping;
    }
}
