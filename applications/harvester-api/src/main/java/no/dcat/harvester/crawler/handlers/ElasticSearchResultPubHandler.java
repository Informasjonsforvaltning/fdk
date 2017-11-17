package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.harvester.crawler.CrawlerResultHandler;
import no.dcat.harvester.crawler.DatasetLookup;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.datastore.domain.dcat.Publisher;
import no.difi.dcat.datastore.domain.dcat.builders.PublisherBuilder;
import org.apache.jena.rdf.model.Model;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Class for loading the complete publisher-hieararchi.
 * <p/>
 * All publisher, and their superioe publisher, refered to from the list of dataset is loaded in
 * a separate index in elastic search.
 * <p/>
 *
 * @author Marcus Gustafson
 */
public class ElasticSearchResultPubHandler implements CrawlerResultHandler {
    public static final String DCAT = "dcat";
    public static final String PUBLISHER_TYPE = "publisher";
    private final Logger logger = LoggerFactory.getLogger(ElasticSearchResultPubHandler.class);

    String hostname;
    int port;
    String clustername;

    public ElasticSearchResultPubHandler(String hostname, int port, String clustername) {
        this.hostname = hostname;
        this.port = port;
        this.clustername = clustername;
    }

    /**
     * Extracts all resources of type publisher, transform the records according to internal datamodel and loads them
     * into elasticsearch. The elasic search instance is defined by host and port.
     * <p/>
     * @param dcatSource - Is not used.
     * @param model - The modellel on rdf-formatt that shall conatin the publishers.
     */
    @Override
    public void process(DcatSource dcatSource, Model model, List<String> validationResults) {
        logger.trace("Processing results Elasticsearch");

        try (Elasticsearch elasticsearch = new Elasticsearch(hostname, port, clustername)) {
            logger.trace("Start indexing");
            indexWithElasticsearch(model, elasticsearch);
        } catch (Exception e) {
            logger.error("Exception occurred while loading publisher: {}", e.getMessage());
            throw e;
        }
        logger.trace("finished");
    }

    protected void indexWithElasticsearch(Model model, Elasticsearch elasticsearch) {
        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").create();

        logger.debug("Preparing bulkRequest for Publishers.");
        BulkRequestBuilder bulkRequest = elasticsearch.getClient().prepareBulk();

        List<Publisher> publishers = new PublisherBuilder(model).build();
        generateOrganizationPath(elasticsearch, publishers, gson);
        for (Publisher publisher: publishers) {

            IndexRequest indexRequest = addPublisherToIndex(gson, publisher);
            bulkRequest.add(indexRequest);
        }

        BulkResponse bulkResponse = bulkRequest.execute().actionGet();
        if (bulkResponse.hasFailures()) {
            logger.error("Load of publisher has error: {}", bulkResponse.buildFailureMessage());
            //TODO: process failures by iterating through each bulk response item?
        }
    }

    void generateOrganizationPath(Elasticsearch elasticsearch, List<Publisher> publishers, Gson gson) {

        final Map<String, Publisher> publisherMap = new HashMap<>();
        publishers.forEach(publisher -> publisherMap.put(publisher.getId(), publisher));

        String[] topDomains = {"STAT", "FYLKE", "KOMMUNE", "PRIVAT"};
        for (String domain : topDomains) {
            Publisher topPub = lookupPublisher(elasticsearch.getClient(), domain, gson);
            if (topPub == null) {
                topPub = new Publisher();
                topPub.setOverordnetEnhet("/");
                topPub.setName(domain);
                publisherMap.put(domain, topPub);
            }
        }

        publishers.forEach( p -> {
            p.setOrgPath(extractOrganizationPath(p, publisherMap));
        });
    }

    String extractOrganizationPath(Publisher p, Map<String, Publisher> publisherMap) {

        if (p.getOverordnetEnhet() != null) {
            Publisher overordnetEnhet = publisherMap.get(p.getOverordnetEnhet());
            return extractOrganizationPath(overordnetEnhet, publisherMap) + "/" + p.getId();
        }

        if (p.getOrganisasjonsform() != null) {
            String orgForm = p.getOrganisasjonsform();

            if ("STAT".equals(orgForm)) {
                return "/STAT";
            }

            if ("FYLKE".equals(orgForm)) {
                return "/FYLKE";
            }

            if ("KOMM".equals(orgForm)) {
                return "/KOMMUNE";
            }
        }

        return "/PRIVAT";
    }

    Publisher lookupPublisher(Client client, String id, Gson gson) {
        GetResponse response = client.prepareGet("dcat", "publisher", id).get();

        if (response.isExists()) {
            Publisher lookup = gson.fromJson(response.getSourceAsString(), Publisher.class);
            return lookup;
        }

        return null;
    }


    protected IndexRequest addPublisherToIndex(Gson gson, Publisher publisher) {
        logger.debug("Add publisher {} to index.", publisher.getId());

        IndexRequest indexRequest = new IndexRequest(DCAT, PUBLISHER_TYPE, publisher.getId());
        indexRequest.source(gson.toJson(publisher));
        return indexRequest;
    }
}
