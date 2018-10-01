package no.dcat.portal.query;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.Data;
import no.dcat.datastore.ElasticDockerRule;
import no.dcat.datastore.Elasticsearch;
import no.dcat.datastore.domain.dcat.Publisher;
import no.dcat.datastore.domain.harvest.CatalogHarvestRecord;
import no.dcat.datastore.domain.harvest.ChangeInformation;
import no.dcat.shared.testcategories.IntegrationTest;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.junit.*;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Random;

import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;


@Category(IntegrationTest.class)
public class HarvestQueryIT {
    private static Logger logger = LoggerFactory.getLogger(HarvestQueryIT.class);

    public static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ssZ";

    private ChangeInformation totalChangesCatalog1, totalChangesCatalog2;

    Elasticsearch elasticsearch;

    @ClassRule
    public static ElasticDockerRule elasticRule = new ElasticDockerRule();

    @Before
    public void setUp() throws Exception {
        elasticsearch = new Elasticsearch("localhost:9399","elasticsearch");
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

    @Test
    public void queryCatalogHarvestRecordsOK () throws Throwable {

        HarvestQueryService service = new HarvestQueryService();
        service.setClient(elasticsearch.getClient());

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
