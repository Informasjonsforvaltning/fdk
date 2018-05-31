package no.dcat.portal.query;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.Data;
import no.dcat.datastore.Elasticsearch;
import no.dcat.datastore.domain.dcat.Publisher;
import no.dcat.datastore.domain.harvest.CatalogHarvestRecord;
import no.dcat.datastore.domain.harvest.ChangeInformation;
import no.dcat.shared.testcategories.UnitTest;
import org.apache.commons.io.FileUtils;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.node.Node;
import org.elasticsearch.node.NodeBuilder;
import org.elasticsearch.search.aggregations.Aggregations;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Random;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;

@Category(UnitTest.class)
public class HarvestQueryTest {
    private static Logger logger = LoggerFactory.getLogger(HarvestQueryTest.class);

    private static final String DATA_DIR = "target/elasticsearch";

    public static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssZ";
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);

    private ChangeInformation totalChangesCatalog1, totalChangesCatalog2;

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

//        elasticsearch = new Elasticsearch("localhost",9300,"elasticsearch");
        elasticsearch.createIndex("harvest");
        totalChangesCatalog1 = generateData(200, 1);
        totalChangesCatalog2 = generateData(100, 2);
    }

    @Data
    class TestData {
        String orgPath;
        String catalogUri;
        List<String> datasets = new ArrayList<>();
    }

    // Generate data for a specific catalog, one instance per day and store in Elasticsearch
    public ChangeInformation generateData(int days, int catalogId) throws InterruptedException {
        ChangeInformation total = new ChangeInformation();

        Gson gson = new GsonBuilder().setDateFormat(DATE_FORMAT).create();
        String catalogUri = "http://catalogs/cat" + catalogId;
        TestData catalog = new TestData();
        catalog.setCatalogUri(catalogUri);
        catalog.setOrgPath("/STAT/1/"+catalogId);

        BulkRequestBuilder bulkRequest = elasticsearch.getClient().prepareBulk();

        long DAY_IN_MS = 24 * 3600* 1000;
        Random randomGenerator = new Random();
        int numberOfDatasets = randomGenerator.nextInt(100);

        if (numberOfDatasets < 4) {
            numberOfDatasets =30;
        }

        Publisher pub = new Publisher();
        pub.setOrgPath(catalog.getOrgPath());

        for (int i = 0; i < days; i++) {

            long now = new Date().getTime();
            now = now - i * DAY_IN_MS;

            CatalogHarvestRecord catalogRecord = new CatalogHarvestRecord();
            catalogRecord.setCatalogUri(catalog.getCatalogUri());
            catalogRecord.setHarvestUrl("http://harvest.url/dcat.json");
            catalogRecord.setDataSourceId("sourcId");
            catalogRecord.setDate(new Date(now));
            catalogRecord.setValidDatasetUris(new HashSet<>());
            catalogRecord.setPublisher(pub);

            ChangeInformation stats = new ChangeInformation();
            // deletes
            int del = randomGenerator.nextInt(numberOfDatasets/4);
            stats.setDeletes(del >=0 ? del : 0);
            int ins = randomGenerator.nextInt(numberOfDatasets/3);
            stats.setInserts(ins >=0 ? ins : 0);
            stats.setUpdates(numberOfDatasets - stats.getDeletes() - stats.getInserts());

            catalogRecord.setChangeInformation(stats);

            total.setDeletes(total.getDeletes() + stats.getDeletes());
            total.setUpdates(total.getUpdates() + stats.getUpdates());
            total.setInserts(total.getInserts() + stats.getInserts());

            logger.debug("index {} - {}i {}u {}d", catalogRecord.getCatalogUri(), catalogRecord.getChangeInformation().getInserts(),
                    catalogRecord.getChangeInformation().getUpdates(),
                    catalogRecord.getChangeInformation().getDeletes());

            IndexRequest catalogCrawlRequest = new IndexRequest("harvest", "catalog");
            catalogCrawlRequest.source(gson.toJson(catalogRecord));

            bulkRequest.add(catalogCrawlRequest);
        }
        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        elasticsearch.getClient().admin().cluster().prepareHealth("harvest").setWaitForYellowStatus().execute().actionGet();

        logger.info("generated {} catalog harvest records for {}: {} inserts, {} updates and {} deletes",
                days, catalogUri, total.getInserts(), total.getUpdates(), total.getDeletes());

        Thread.sleep(1500);

        return total;
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
    public void queryCatalogHarvestRecordsOK () throws Throwable {

        HarvestQueryService service = new HarvestQueryService();
        service.setClient(client);

        // First query, all under /STAT
        ResponseEntity<String> response = service.listCatalogHarvestRecords("/STAT/1");
        JsonElement completeResponseAsElement = new JsonParser().parse(response.getBody());
        JsonObject aggregationsAsElement = completeResponseAsElement.getAsJsonObject().getAsJsonObject("aggregations");
        int deletes = aggregationsAsElement.getAsJsonObject("last365days").getAsJsonObject("deletes").getAsJsonPrimitive("value").getAsInt();
        int inserts = aggregationsAsElement.getAsJsonObject("last365days").getAsJsonObject("inserts").getAsJsonPrimitive("value").getAsInt();

        assertThat(inserts, is(totalChangesCatalog1.getInserts()+totalChangesCatalog2.getInserts()));
        assertThat(deletes, is(totalChangesCatalog1.getDeletes()+ totalChangesCatalog2.getDeletes()));

        logger.debug(response.getBody());

        // Second query, all under /STAT/1/1
        response = service.listCatalogHarvestRecords("/STAT/1/1");

        completeResponseAsElement = new JsonParser().parse(response.getBody());
        aggregationsAsElement = completeResponseAsElement.getAsJsonObject().getAsJsonObject("aggregations");
        deletes = aggregationsAsElement.getAsJsonObject("last365days").getAsJsonObject("deletes").getAsJsonPrimitive("value").getAsInt();
        inserts = aggregationsAsElement.getAsJsonObject("last365days").getAsJsonObject("inserts").getAsJsonPrimitive("value").getAsInt();

        assertThat(inserts, is(totalChangesCatalog1.getInserts()));
        assertThat(deletes, is(totalChangesCatalog1.getDeletes()));

        logger.debug(response.getBody());

    }
}
