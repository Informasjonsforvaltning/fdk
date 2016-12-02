package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import no.dcat.harvester.crawler.client.RetrieveDataThemes;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.datastore.domain.dcat.DataTheme;
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

public class ElasticsearchResultHandlerTest {

	private static final String HOME_DIR = "src/test/resources/elasticsearch";
	private static final String DCAT_INDEX = "dcat";
	public static final String DATASET_TYPE = "dataset";
	public static final String DISTRIBUTION_TYPE = "distribution";

	private final Logger logger = LoggerFactory.getLogger(ElasticsearchResultHandlerTest.class);

	Node node;
	Client client;
	Elasticsearch elasticsearch;

	private File homeDir = null;

	@Before
	public void setUp() throws Exception {

		homeDir = new File("src/test/resources/elasticsearch");
		 Settings settings = Settings.settingsBuilder()
				.put("http.enabled", "false")
				.put("path.home", homeDir.toString())
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
		if (homeDir != null && homeDir.exists()) {
			FileUtils.forceDelete(homeDir);
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
		elasticsearch.createIndex(RetrieveDataThemes.INDEX_THEME);
		elasticsearch.indexDocument(RetrieveDataThemes.INDEX_THEME, RetrieveDataThemes.TYPE_DATA_THEME, "t1", theme1);

		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
		ClassLoader classLoader = getClass().getClassLoader();

		DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", classLoader.getResource("npolar.jsonld").getFile(), "tester",
				"123456789");

		ElasticSearchResultHandler handler = new ElasticSearchResultHandler("", 0, "elasticsearch");
		handler.indexWithElasticsearch(dcatSource, FileManager.get().loadModel(dcatSource.getUrl()), new Elasticsearch(client));

		//prevent race condition where elasticsearch is still indexing!!!
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		assertTrue("dcat index exists", elasticsearch.indexExists(DCAT_INDEX));

		SearchRequestBuilder srb_distribution = client.prepareSearch(DCAT_INDEX).setTypes(DISTRIBUTION_TYPE).setQuery(QueryBuilders.matchAllQuery());
		SearchResponse sr_distribution = null;
		sr_distribution = srb_distribution.execute().actionGet();
		assertTrue("Distribution document(s) exist", sr_distribution.getHits().getTotalHits() > 0);

		SearchRequestBuilder srb_dataset = client.prepareSearch(DCAT_INDEX).setTypes(DATASET_TYPE).setQuery(QueryBuilders.matchAllQuery());
		SearchResponse sr_dataset = null;
		sr_dataset = srb_dataset.execute().actionGet();
		assertTrue("Dataset document(s) exist", sr_dataset.getHits().getTotalHits() > 0);

	}

}