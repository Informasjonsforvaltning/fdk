package no.dcat.harvester.crawler.client;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.data.store.Elasticsearch;
import no.dcat.harvester.theme.builders.vocabulary.GeonamesRDF;
import no.dcat.shared.LocationUri;
import no.dcat.shared.SkosCode;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.atlas.web.HttpException;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.NodeIterator;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.vocabulary.DCTerms;
import org.elasticsearch.action.admin.indices.refresh.RefreshRequest;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Class for loading and retrieving locations from/into elasticsearch.
 */
public class LoadLocations {
    public static final String[] LANGUAGES = new String[]{"en", "no", "nn", "nb"};

    private final String themesHostname;
    private final String httpUsername;
    private final String httpPassword;

    Map<String, SkosCode> locations = new HashMap<>();

    public LoadLocations(String themesHostname, String httpUsername, String httpPassword) {
        this.themesHostname = themesHostname;
        this.httpUsername = httpUsername;
        this.httpPassword = httpPassword;
    }



    private final Logger logger = LoggerFactory.getLogger(LoadLocations.class);

    // for testing
    public LoadLocations(Map<String, SkosCode> locations) {
        this.locations = locations;
        themesHostname = null;
        httpPassword = null;
        httpUsername = null;
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
    public void addLocationsToThemes(Model model) {

        BasicAuthRestTemplate template = new BasicAuthRestTemplate(httpUsername, httpPassword);

        NodeIterator nodeIterator = model.listObjectsOfProperty(DCTerms.spatial);
        nodeIterator.forEachRemaining(node -> {

            SkosCode skosCode = template.postForObject(themesHostname + "/locations/", new LocationUri(node.asResource().getURI()), SkosCode.class);
            locations.put(skosCode.getUri(), skosCode);

        });

    }


    public  List<SkosCode> getLocations(List<String> strings) {
        return strings.stream()
                .map(locations::get)
                .distinct()
                .collect(Collectors.toList());

    }
}
