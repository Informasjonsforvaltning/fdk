package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import no.dcat.datastore.DcatIndexUtils;
import no.dcat.datastore.ElasticDockerRule;
import no.dcat.shared.Dataset;
import no.dcat.datastore.domain.DcatSource;
import no.dcat.shared.testcategories.IntegrationTest;
import org.apache.commons.io.IOUtils;
import org.apache.jena.util.FileManager;
import org.elasticsearch.action.admin.cluster.health.ClusterHealthResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.QueryBuilders;
import org.junit.*;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.File;
import java.io.FileOutputStream;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;


@Category(IntegrationTest.class)
public class ElasticsearchResultHandlerIT {

	private static final String DCAT_INDEX = "dcat";
	public static final String DATASET_TYPE = "dataset";

	private final Logger logger = LoggerFactory.getLogger(ElasticsearchResultHandlerIT.class);

	Elasticsearch5Client elasticsearch;

	@ClassRule
	public static ElasticDockerRule elasticRule = new ElasticDockerRule();

	@Before
	public void setUp() throws Exception {
		elasticsearch = new Elasticsearch5Client("localhost:9399","elasticsearch");
	}

	@Test
	public void testThatEmbeddedElasticsearchWorks() {
		ClusterHealthResponse healthResponse = null;
		try {
			healthResponse = elasticsearch.getClient().admin().cluster().prepareHealth().setTimeout(new TimeValue(5000)).execute()
					.actionGet();
			logger.info("Connected to Elasticsearch: " + healthResponse.getStatus().toString());
		} catch (Exception e) {
			logger.error("Failed to connect to Elasticsearch: " + e);
		}
		assertTrue(healthResponse.getStatus() != null);
	}


	/**
	 * Tests if indexWithElasticsearch.
	 */
	@Test
	public void testCrawlingIndexesToElasticsearchIT() throws  Throwable {
		//prevent race condition where elasticsearch is still indexing!!!
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		// copy catalog info to temporary file to have a stable url for multipleharvests
		Resource catalogResource = new ClassPathResource("ramsund-elastic.ttl");
		File f = File.createTempFile("ramsund-elastic", ".ttl");
		f.deleteOnExit();
		FileOutputStream out = new FileOutputStream(f);
		IOUtils.copy(catalogResource.getInputStream(),out);
		out.close();

		String ramsundUrl = f.toURI().toURL().toString();
		logger.debug("stable harvest url: ", ramsundUrl);

        // First harvest of ramsun, file contains one dataset
		DcatSource dcatSource = new DcatSource("http//dcat.difi.no/test", "Test",
                ramsundUrl, "tester",
				"123456789");
        harvestSource(dcatSource);

		DcatIndexUtils dcatIndexUtils = new DcatIndexUtils(elasticsearch);
        assertTrue("dcat index exists", dcatIndexUtils.indexExists(DCAT_INDEX));
		assertTrue("harvest index exists", dcatIndexUtils.indexExists("harvest"));

		SearchRequestBuilder srb_dataset = elasticsearch.getClient().prepareSearch(DCAT_INDEX).setTypes(DATASET_TYPE).setQuery(QueryBuilders.matchAllQuery());
		SearchResponse searchResponse = null;
		searchResponse = srb_dataset.execute().actionGet();
		logDatasets(searchResponse);

		assertThat("Dataset document(s) exist", searchResponse.getHits().getTotalHits(), is(1l));


		// Second harvest, no changes
        harvestSource(dcatSource);
        searchResponse = srb_dataset.execute().actionGet();
        logDatasets(searchResponse);

        srb_dataset = elasticsearch.getClient().prepareSearch("harvest").setTypes("catalog").setQuery(QueryBuilders.matchAllQuery());
		SearchResponse catalogHarvestRecordResponse = srb_dataset.execute().actionGet();

		assertThat("Should have 2 or more catalogHarvestRecords",
				catalogHarvestRecordResponse.getHits().getTotalHits(), greaterThanOrEqualTo(2l));


		// Update file with new dataset and removed old
		Resource updatedCatalogResource = new ClassPathResource("ramsund-elastic2.ttl");
		out = new FileOutputStream(f);
		IOUtils.copy(updatedCatalogResource.getInputStream(),out);
		out.close();

        // Third harvest of ramsund but with previous dataset deleted, (new one added)
        dcatSource = new DcatSource("http//dcat.difi.no/test", "Test", ramsundUrl, "tester",
                "123456789");
        harvestSource(dcatSource);


        srb_dataset = elasticsearch.getClient().prepareSearch(DCAT_INDEX).setTypes(DATASET_TYPE).setQuery(QueryBuilders.matchAllQuery());
        searchResponse = srb_dataset.execute().actionGet();
        logDatasets(searchResponse);

        assertThat("Old dataset should be deleted and new inserted total of 1", searchResponse.getHits().getTotalHits(), is(1l));

    }

	private void logDatasets(SearchResponse searchResponse) {
		for (long i= 0; i < searchResponse.getHits().getTotalHits(); i++) {
			Dataset d = new Gson().fromJson(searchResponse.getHits().getAt((int)i).getSourceAsString(), Dataset.class);
			logger.info("dataset uri={}, id={}", d.getUri(), d.getId());
		}
	}


	private void sleep() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void harvestSource(DcatSource dcatSource) {
        ElasticSearchResultHandler handler = new ElasticSearchResultHandler("", "elasticsearch","http://localhost:8100", "user", "password");
        handler.indexWithElasticsearch(dcatSource, FileManager.get().loadModel(dcatSource.getUrl()), new Elasticsearch5Client(elasticsearch.getClient()),null);

        //prevent race condition where elasticsearch is still indexing!!!
        sleep();
    }

}