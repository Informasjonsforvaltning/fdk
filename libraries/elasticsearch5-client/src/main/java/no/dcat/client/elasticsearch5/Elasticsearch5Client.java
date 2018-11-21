package no.dcat.client.elasticsearch5;

import org.elasticsearch.client.Client;
import org.elasticsearch.cluster.health.ClusterHealthStatus;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;


public class Elasticsearch5Client implements AutoCloseable {

    private static final String CLUSTER_NAME = "cluster.name";
    private final Logger logger = LoggerFactory.getLogger(Elasticsearch5Client.class);

    private Client client;


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

    public static List<ElasticsearchNode> parseHostsString(final String hosts) {
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

    public static class ElasticsearchNode {
        public String host;
        public int port;
    }
}
