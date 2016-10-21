package no.difi.dcat.datastore;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.cluster.health.ClusterHealthStatus;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Scanner;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class Elasticsearch implements AutoCloseable {

	private static final String DCAT_INDEX_SETUP_FILENAME = "index_setup.json";
	private static final String CLUSTER_NAME = "cluster.name";
	private final Logger logger = LoggerFactory.getLogger(Elasticsearch.class);

	private Client client;

	public Elasticsearch(String host, int port) {
		logger.debug("Attempt to connect to Elasticsearch client: "+host + ":" + port);
		this.client = returnElasticsearchTransportClient(host, port);
		logger.debug("transportclient success ...? "+ this.client);
	}

	public Elasticsearch(Client client) {
		this.client = client;
	}

//	public Client returnElasticsearchTransportClient(String host, int port, String clusterName) {
//		Client client = null;
//		Settings settings = null;
//		try {
//			settings = Settings.settingsBuilder().put(CLUSTER_NAME, clusterName).build();
//			client = TransportClient.builder().settings(settings).build()
//					.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName(host), port));
//		} catch (UnknownHostException e) {
//			logger.error(e.toString());
//		}
//
//		return client;
//	}

	public Client returnElasticsearchTransportClient(String host, int port) {
		Client client = null;
		try {
			logger.debug("Connect to elasticsearch: " + host + " : "+ port);

			InetAddress inetaddress = InetAddress.getByName(host);
			InetSocketTransportAddress address = new InetSocketTransportAddress(inetaddress, port);

			client = TransportClient.builder().build()
					.addTransportAddress(address);

			logger.debug("Client returns! " + address.toString() );

		} catch (UnknownHostException e) {
			logger.error(e.toString());
		}

		logger.debug("transportclient: " + client);
		return client;

	}

	public boolean isElasticsearchRunning() {
		return elasticsearchStatus() != null;
	}

	public ClusterHealthStatus elasticsearchStatus() {
		return client.admin().cluster().prepareHealth().execute().actionGet().getStatus();
	}

	public boolean documentExists(String index, String type, String id) {
		return client.prepareGet(index, type, id).execute().actionGet().isExists();
	}

	public boolean indexExists(String index) {
		return client.admin().indices().prepareExists(index).execute().actionGet().isExists();
	}

	public void createIndex(String index) {
		//Set mapping for correct language stemming and indexing
		ClassLoader classLoader = getClass().getClassLoader();
		File mappingJsonFile = new File(classLoader.getResource(DCAT_INDEX_SETUP_FILENAME).getFile());

        StringBuilder mappingStr = new StringBuilder("");
        try (Scanner scanner = new Scanner(mappingJsonFile)) {

            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                mappingStr.append(line).append("\n");
            }

            scanner.close();

        } catch (IOException e) {
            e.printStackTrace();
        }

        String mappingJson = mappingStr.toString();

        logger.debug("[createIndex] mappingJson prepared: " + mappingJson);

        client.admin().indices().prepareCreate(index).execute().actionGet();
        logger.debug("[createIndex] before preparePutMapping");
		client.admin().indices().preparePutMapping(index).setType("dataset").setSource(mappingJson).execute().actionGet();
        logger.debug("[createIndex] after preparePutMapping");
		client.admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();
        logger.debug("[createIndex] after prepareHealth");
	}

	public boolean indexDocument(String index, String type, String id, JsonObject jsonObject) {
		IndexResponse rsp = client.prepareIndex(index, type, id).setSource(jsonObject).execute().actionGet();
		return rsp.isCreated();
	}

	public boolean indexDocument(String index, String type, String id, JsonArray jsonArray) {
		IndexResponse rsp = client.prepareIndex(index, type, id).setSource(jsonArray).execute().actionGet();
		return rsp.isCreated();
	}

	public boolean indexDocument(String index, String type, String id, String string) {
		IndexResponse rsp = client.prepareIndex(index, type, id).setSource(string).execute().actionGet();
		return rsp.isCreated();
	}

	public boolean indexDocument(String index, String type, String id, Map<String, Object> map) {
		IndexResponse rsp = client.prepareIndex(index, type, id).setSource(map).execute().actionGet();
		return rsp.isCreated();
	}

	public boolean deleteDocument(String index, String type, String id) {
		DeleteResponse rsp = client.prepareDelete(index, type, id).execute().actionGet();
		return !rsp.isFound();
	}


	public void close() {
		client.close();
	}

	public Client getClient() {
		return client;
	}
}
