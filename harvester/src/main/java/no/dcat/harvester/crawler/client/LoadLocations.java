package no.dcat.harvester.crawler.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.harvester.dcat.domain.theme.builders.vocabulary.GeonamesRDF;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.dcat.SkosCode;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.DCTerms;
import org.elasticsearch.action.admin.indices.refresh.RefreshRequest;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Class for loading and retrieving locations from/into elasticsearch.
 */
public class LoadLocations {
    public static final String CODES_INDEX = "codes";
    public static final String LOCATION_TYPE = "locations";
    public static final String[] LANGUAGES = new String[]{"en", "no", "nn", "nb"};

    private final Client client;

    // Map where key is uri to location and code is the corresponding object as it is represented in elasticsearch.
    protected Map<String, SkosCode> locations = new HashMap<>();

    private final Logger logger = LoggerFactory.getLogger(LoadLocations.class);

    public LoadLocations(Elasticsearch elasticsearch) {
        client = elasticsearch.getClient();
    }

    /**
     * Extracts all location-uris from the model and adds it to the map of locations.
     * The locations-uri represent the key in the map. Titel is empty while these are fetched
     * from a web-call over the net.
     * <p/>
     *
     * @param model
     * @return
     */
    public LoadLocations extractLocations(Model model) {

        ResIterator locIter = model.listSubjectsWithProperty(DCTerms.spatial);
        while (locIter.hasNext()) {
            Resource resource = locIter.next();
            String locUri = resource.getPropertyResourceValue(DCTerms.spatial).getURI();
            SkosCode code = new SkosCode(locUri, null, new HashMap<>());
            locations.put(locUri, code);

            logger.info("Extract location with URI {}", locUri);
        }
        return this;
    }

    /**
     * Looops over the list of locations and retrieves the title for each of them.
     * The titel is first lookup in elastic-search, and if not found look up through the provided uri.
     *
     * @return LoadLocations
     */
    public LoadLocations retrieveLocTitle() {
        Iterator locIter = locations.entrySet().iterator();

        while (locIter.hasNext()) {
            Map.Entry loc = (Map.Entry) locIter.next();
            String locUri = (String) loc.getKey();

            logger.info("Retrieve location title with URI {}", locUri);
            if (StringUtils.isEmpty(locUri)) {
                continue;
            }

            Model locModel = retrieveTitleOfLocations(locUri);

            ResIterator resIter = locModel.listResourcesWithProperty(GeonamesRDF.gnOfficialName);
            while (resIter.hasNext()) {
                Map<String, String> titleMap = extractLocationTitle(resIter.next());
                SkosCode code = (SkosCode) loc.getValue();
                code.setPrefLabel(titleMap);
            }
        }

        return this;
    }

    private Map<String, String> extractLocationTitle(Resource resource) {
        Map<String, String> titleMap = new HashMap();

        StmtIterator stmIter = resource.listProperties(GeonamesRDF.gnOfficialName);
        extractProperty(titleMap, stmIter);

        stmIter = resource.listProperties(GeonamesRDF.gnShortName);
        extractProperty(titleMap, stmIter);

        return titleMap;
    }

    private void extractProperty(Map<String, String> titleMap, StmtIterator stmIter) {
        while (stmIter.hasNext()) {
            Statement stmt = stmIter.nextStatement();
            String lang = stmt.getLanguage();
            String title = stmt.getString();

            if (Arrays.stream(LANGUAGES).parallel().anyMatch(lang::contains)) {
                titleMap.put(lang, title);
            }

            logger.trace("Retrieve title {} for lang {}", title, lang);
        }
    }

    private Model retrieveTitleOfLocations(String locUri) {
        logger.debug("Retrieve name of location with URI {}", locUri);

        String locUriAbout = String.format("%sabout.rdf", locUri);
        Model locModel = RetrieveModel.remoteRDF(locUriAbout);
        locModel.listSubjectsWithProperty(GeonamesRDF.gnOfficialName);
        return locModel;
    }

    public Map<String, SkosCode> getLocations() {
        return locations;
    }

    public LoadLocations indexLocationsWithElasticSearch() {
        BulkRequestBuilder bulkRequest = client.prepareBulk();

        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();

        Iterator locations = this.locations.entrySet().iterator();
        while (locations.hasNext()) {
            Map.Entry locEntry = (Map.Entry) locations.next();
            SkosCode location = (SkosCode) locEntry.getValue();

            IndexRequest indexRequest = new IndexRequest(CODES_INDEX, LOCATION_TYPE, location.getUri());
            indexRequest.source(gson.toJson(location));
            bulkRequest.add(indexRequest);

            logger.debug("Add location {} to bulk request", location.getUri());
        }

        if(bulkRequest.numberOfActions() > 0){
            BulkResponse bulkResponse = bulkRequest.execute().actionGet();
            if (bulkResponse.hasFailures()) {
                throw new RuntimeException(
                        String.format("Load of locations to elasticsearch has error: %s", bulkResponse.buildFailureMessage()));
            }
        }
        return this;
    }

    public LoadLocations refresh() {
        client.admin().indices().refresh(new RefreshRequest(CODES_INDEX)).actionGet();
        return this;
    }
}
