package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.client.elasticsearch5.Elasticsearch5Client;
import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.dcat.Publisher;
import no.dcat.datastore.domain.dcat.builders.PublisherBuilder;
import no.dcat.harvester.crawler.CrawlerResultHandler;
import org.apache.jena.rdf.model.Model;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    String clusterNodes;
    String clusterName;

    public ElasticSearchResultPubHandler(String clusterNodes, String clusterName) {
        this.clusterNodes = clusterNodes;
        this.clusterName = clusterName;
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

        try (Elasticsearch5Client elasticsearch = new Elasticsearch5Client(clusterNodes, clusterName)) {
            logger.trace("Start indexing");
            indexWithElasticsearch(model, elasticsearch);
        } catch (Exception e) {
            logger.error("Exception occurred while loading publisher: {}", e.getMessage());
            throw e;
        }
        logger.trace("finished");
    }

    protected void indexWithElasticsearch(Model model, Elasticsearch5Client elasticsearch) {
        if (model != null && elasticsearch != null) {
            Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").create();

            logger.debug("Preparing bulkRequest for Publishers.");
            BulkRequestBuilder bulkRequest = elasticsearch.getClient().prepareBulk();

            List<Publisher> publishers = new PublisherBuilder(model).build();
            publishers.addAll(getTopAgentsNotIndexed(elasticsearch, publishers, gson));

            for (Publisher publisher : publishers) {

                IndexRequest indexRequest = addPublisherToIndex(gson, publisher);
                bulkRequest.add(indexRequest);
            }

            BulkResponse bulkResponse = bulkRequest.execute().actionGet();
            if (bulkResponse.hasFailures()) {
                logger.error("Load of publisher has error: {}", bulkResponse.buildFailureMessage());
                //TODO: process failures by iterating through each bulk response item?
            }
        }
    }

    public List<Publisher> getTopAgentsNotIndexed(Elasticsearch5Client elasticsearch, List<Publisher> publishers, Gson gson) {
        List<Publisher> result = new ArrayList<>();

        String[] topDomains = {"STAT", "FYLKE", "KOMMUNE", "PRIVAT", "ANNET"};
        for (String domain : topDomains) {
            Publisher topPub = lookupPublisher(elasticsearch.getClient(), domain, gson);
            if (topPub == null) {
                topPub = new Publisher();
                topPub.setOverordnetEnhet("/");
                topPub.setOrgPath("/"+ domain);
                topPub.setId(domain);
                topPub.setName(domain);

                result.add (topPub);
            }
        }

        return result;
    }

    public Publisher lookupPublisher(Client client, String id, Gson gson) {
        GetResponse response = client.prepareGet("dcat", "publisher", id).get();

        if (response.isExists()) {
            return gson.fromJson(response.getSourceAsString(), Publisher.class);
        }

        return null;
    }

    protected IndexRequest addPublisherToIndex(Gson gson, Publisher publisher) {
        if (publisher.getId() == null) {
            Pattern p = Pattern.compile("(enhetsregisteret/enhet/)(\\d+)");
            Matcher m = p.matcher(publisher.getUri());

            if (m.find()) {
                publisher.setId(m.group(2));
            }
        }

        if (publisher.getId() == null) {
            publisher.setId(publisher.getUri());
        }

        logger.debug("Add publisher {} to index.", publisher.getId());

        IndexRequest indexRequest = new IndexRequest(DCAT, PUBLISHER_TYPE, publisher.getId());
        indexRequest.source(gson.toJson(publisher));
        return indexRequest;
    }
}
