package no.difi.dcat.datastore;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.commons.io.IOUtils;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.cluster.health.ClusterHealthStatus;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import java.io.File;
import java.io.InputStream;
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

		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		try {
			Resource[] resources = resolver.getResources("classpath*:" + DCAT_INDEX_SETUP_FILENAME);

			for (Resource r : resources) {

				InputStream is = r.getInputStream();

				String mappingJson = IOUtils.toString(is, "UTF-8");


				logger.debug("[createIndex] mappingJson prepared: " + mappingJson);

				client.admin().indices().prepareCreate(index).execute().actionGet();
				logger.debug("[createIndex] before preparePutMapping");
				client.admin().indices().preparePutMapping(index).setType("dataset").setSource(mappingJson).execute().actionGet();
				logger.debug("[createIndex] after preparePutMapping");
				client.admin().cluster().prepareHealth(index).setWaitForYellowStatus().execute().actionGet();
				logger.debug("[createIndex] after prepareHealth");
			}
		} catch (IOException e) {
			logger.error("Unable to create index for Elasticsearch " + e.getMessage() );
		}
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
