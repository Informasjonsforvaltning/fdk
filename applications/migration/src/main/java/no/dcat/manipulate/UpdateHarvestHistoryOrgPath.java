package no.dcat.manipulate;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationConfig;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import no.dcat.datastore.Elasticsearch;
import no.dcat.datastore.domain.harvest.CatalogHarvestRecord;
import no.dcat.shared.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;


public class UpdateHarvestHistoryOrgPath {
    public static Logger logger = LoggerFactory.getLogger(UpdateHarvestHistoryOrgPath.class);
    public static String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";
    private static SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);

    final String elasticUrl = "http://localhost:9200/"; //"http://elasticsearch-fellesdatakatalog-ppe.ose-pc.brreg.no"; //"http://elasticsearch-fellesdatakatalog-st2.ose-npc.brreg.no";

    private int numberOfRecordsUpdated;
    List<Publisher> updatedPublishers = new ArrayList<>();

    public static void main(String... args) {

        UpdateHarvestHistoryOrgPath program = new UpdateHarvestHistoryOrgPath();
        program.readHarvestHistory();

    }

    public void readHarvestHistory() {
        RestTemplate restTemplate = new RestTemplate();
        String query = "{ size:0, aggs: { distinct_publishers: {terms : { field: \"publisher.id\", size: 0}}}}";

        ResponseEntity<String> distinctPublishersResponse = restTemplate.postForEntity(elasticUrl + "/harvest/catalog/_search", query, String.class);

        if (distinctPublishersResponse.getStatusCode().is2xxSuccessful()) {

            JsonArray array = new Gson().fromJson(distinctPublishersResponse.getBody(), JsonObject.class)
                    .get("aggregations").getAsJsonObject()
                    .get("distinct_publishers").getAsJsonObject()
                    .get("buckets").getAsJsonArray();

            List<String> organizations = new ArrayList<>();
            for (JsonElement element : array) {
                String orgnumber = element.getAsJsonObject().get("key"). getAsString();
                organizations.add(orgnumber);
            }

            for (String orgNumber : organizations) {
                processOrganization(orgNumber);
            }

            logger.info("Total of {} records updated", numberOfRecordsUpdated);
            for (Publisher publisher : updatedPublishers) {
                logger.info("{}", publisher);
            }

        }

    }

    private void processOrganization(String  organizationNumber) {
        logger.info ("Processing orgnumber: {}", organizationNumber);

        RestTemplate restTemplate = new RestTemplate();

        String queryUrl = "/harvest/catalog/_search?q=publisher.id:" + organizationNumber;

        ResponseEntity<String> responseEntity = restTemplate.getForEntity(elasticUrl +queryUrl + "&size=0", String.class);

        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            long total = new Gson().fromJson(responseEntity.getBody(), JsonObject.class).get("hits").getAsJsonObject().get("total").getAsLong();

            responseEntity = restTemplate.getForEntity(elasticUrl + queryUrl + "&size=" + total, String.class);

            List<ElasticRecord<CatalogHarvestRecord>> records = readRecords(responseEntity.getBody());

            // sort descending
            records.sort(new Comparator<ElasticRecord<CatalogHarvestRecord>>() {
                @Override
                public int compare(ElasticRecord<CatalogHarvestRecord> lhs, ElasticRecord<CatalogHarvestRecord> rhs) {
                    return rhs.get_source().getDate().compareTo(lhs.get_source().getDate());
                }
            });

            logger.info("Number of records: {}", records.size());
            Publisher godPublisher = null;
            List<ElasticRecord<CatalogHarvestRecord>> badRecords = new ArrayList<>();
            for (ElasticRecord<CatalogHarvestRecord> elasticRecord : records) {
                CatalogHarvestRecord record = elasticRecord.get_source();
                Publisher publisher = record.getPublisher();
                logger.info("{}\t{}\t{}\t{}\t{}\t{}", elasticRecord.get_id(), dateFormat.format(record.getDate()), publisher.getId(), publisher.getUri(), publisher.getOrgPath(), record.getCatalogUri());


                if (publisher.getOrgPath().startsWith("/ANNET/")) {
                    badRecords.add(elasticRecord);

                } else {
                    godPublisher = publisher;
                }
            }
            if (godPublisher != null) {
                final String correctOrgPath = godPublisher.getOrgPath();
                final String correctUri = godPublisher.getUri();
                if (badRecords.size() > 0 && badRecords.size() < total) {
                    // update bad records
                    Publisher badPublisher = badRecords.get(0).get_source().getPublisher();
                    updatedPublishers.add(badPublisher);

                    logger.info("Update {} bad records for {} {}", badRecords.size(), badPublisher.getId(), badPublisher.getName());

                    // fix errors
                    badRecords.forEach(record -> {
                        logger.info("{} from: {} to: {}", record.get_id(), record.get_source().getPublisher().getOrgPath(), correctOrgPath);
                        record.get_source().getPublisher().setOrgPath(correctOrgPath);
                        record.get_source().getPublisher().setUri(correctUri);
                    });

                    // update errors
                    badRecords.forEach(elasticRecord -> {
                        CatalogHarvestRecord record = elasticRecord.get_source();
                        Publisher publisher = record.getPublisher();
                        numberOfRecordsUpdated++;

                        logger.info("{}\t{}\t{}\t{}\t{}\t{}", elasticRecord.get_id(), dateFormat.format(record.getDate()), publisher.getId(), publisher.getUri(), publisher.getOrgPath(), record.getCatalogUri());

                        String url = elasticUrl + "harvest/catalog/" + elasticRecord.get_id();

                        // TODO Update bad records
                        logger.debug("PUT:     {}", url);
                        logger.debug("payload: {}", record.toString());

                        restTemplate.put(url, record);
                    });
                }
            }
        }
    }

    Gson getGson() {
        return new GsonBuilder().setDateFormat(DATE_FORMAT).create();
    }

    public List<ElasticRecord<CatalogHarvestRecord>> readRecords(String elasticSearchResult) {

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        try {
            JsonNode searchResult = mapper.readTree(elasticSearchResult).get("hits").get("hits");

            List<ElasticRecord<CatalogHarvestRecord>> result = mapper.readValue(searchResult.toString(), new TypeReference<List< ElasticRecord<CatalogHarvestRecord>>>(){});

            return result;

        } catch (IOException e) {
            logger.error("IOEX");
        }

        return null;
    }


}
