package no.dcat.harvester.crawler.handlers;

import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.DcatSource;
import org.apache.commons.io.FileUtils;
import org.apache.jena.util.FileManager;
import org.elasticsearch.action.admin.cluster.health.ClusterHealthResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.node.Node;
import org.elasticsearch.node.NodeBuilder;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;

import static org.junit.Assert.assertTrue;

public class ElasticsearchResultHandlerIT {

	private static final String DATA_DIR = "target/elasticsearch";
	private static final String DCAT_INDEX = "dcat";
	public static final String DATASET_TYPE = "dataset";

	private final Logger logger = LoggerFactory.getLogger(ElasticsearchResultHandlerIT.class);

	Node node;
	Client client;
	Elasticsearch elasticsearch;

	private File dataDir = null;

	@Before
	public void setUp() throws Exception {

		dataDir = new File(DATA_DIR);
		 Settings settings = Settings.settingsBuilder()
				.put("http.enabled", "false")
				.put("path.home", dataDir.toString())
				.build();

		node = NodeBuilder.nodeBuilder()
				.local(true)
				.settings(settings)
				.build();

		node.start();
		client = node.client();
		Assert.assertNotNull(node);
		Assert.assertFalse(node.isClosed());
		Assert.assertNotNull(client);
		elasticsearch = new Elasticsearch(client);

	}

	@After
	public void tearDown() throws Exception {
		if (client != null) {
			client.close();
		}
		if (node != null) {
			node.close();
		}
		if (dataDir != null && dataDir.exists()) {
			FileUtils.forceDelete(dataDir);
		}

		node = null;
		client = null;

	}

	@Test
	public void testThatEmbeddedElasticsearchWorks() {
		ClusterHealthResponse healthResponse = null;
		try {
			healthResponse = client.admin().cluster().prepareHealth().setTimeout(new TimeValue(5000)).execute()
					.actionGet();
			logger.info("Connected to Elasticsearch: " + healthResponse.getStatus().toString());
		} catch (Exception e) {
			logger.error("Failed to connect to Elasticsearch: " + e);
		}
		assertTrue(healthResponse.getStatus() != null);
	}

	private String theme1 = "{\n" +
			"  \"id\": \"http://publications.europa.eu/resource/authority/data-theme/SOCI\",\n" +
			"  \"code\": \"SOCI\",\n" +
			"  \"startUse\": \"2015-10-01\",\n" +
			"  \"title\": {\n" +
			"    \"nb\": \"Befolkning og samfunn\",\n" +
			"    \"en\": \"Population and society\"\n" +
			"  },\n" +
			"  \"conceptSchema\": {\n" +
			"    \"id\": \"http://publications.europa.eu/resource/authority/data-theme\",\n" +
			"    \"title\": \"Dataset types Named Authority List\",\n" +
			"    \"versioninfo\": \"20160921-0\",\n" +
			"    \"versionnumber\": \"20160921-0\"\n" +
			"  }\n" +
			"}";

	/**
	 * Tests if indexWithElasticsearch.
	 */
	@Test
	public void testCrawlingIndexesToElasticsearchIT() {
		//prevent race condition where elasticsearch is still indexing!!!
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		ClassLoader classLoader = getClass().getClassLoader();

		DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", classLoader.getResource("ramsund-elastic.ttl").getFile(), "tester",
				"123456789");

		ElasticSearchResultHandler handler = new ElasticSearchResultHandler("", 0, "elasticsearch", "http://localhost:8100", "user", "password");
		handler.indexWithElasticsearch(dcatSource, FileManager.get().loadModel(dcatSource.getUrl()), new Elasticsearch(client),null);

		//prevent race condition where elasticsearch is still indexing!!!
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		assertTrue("dcat index exists", elasticsearch.indexExists(DCAT_INDEX));

		assertTrue("harvest index exists", elasticsearch.indexExists("harvest"));

		SearchRequestBuilder srb_dataset = client.prepareSearch(DCAT_INDEX).setTypes(DATASET_TYPE).setQuery(QueryBuilders.matchAllQuery());
		SearchResponse sr_dataset = null;
		sr_dataset = srb_dataset.execute().actionGet();
		assertTrue("Dataset document(s) exist", sr_dataset.getHits().getTotalHits() > 0);

	}

}