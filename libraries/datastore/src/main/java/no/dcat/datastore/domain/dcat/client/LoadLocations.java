package no.dcat.datastore.domain.dcat.client;

import no.dcat.shared.LocationUri;
import no.dcat.shared.SkosCode;
import no.dcat.datastore.domain.dcat.builders.AbstractBuilder;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.vocabulary.DCTerms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Class for loading and retrieving locations from/into elasticsearch.
 */
public class LoadLocations {

    private final String referenceDataUrl;
    private final String httpUsername;
    private final String httpPassword;

    Map<String, SkosCode> locations = new HashMap<>();

    public LoadLocations(String referenceDataUrl, String httpUsername, String httpPassword) {
        this.referenceDataUrl = referenceDataUrl;
        this.httpUsername = httpUsername;
        this.httpPassword = httpPassword;
    }

    public Map<String,SkosCode> getLocations() {
        return this.locations;
    }

    private final Logger logger = LoggerFactory.getLogger(LoadLocations.class);

    // for testing
    public LoadLocations(Map<String, SkosCode> locations) {
        this.locations = locations;
        referenceDataUrl = null;
        httpPassword = null;
        httpUsername = null;
    }

    public SkosCode getLocation(String uri) {
        return locations.get(uri);
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
    public void addLocationsToThemes(Model model, Map<String, SkosCode> existingLocationCodes) {

        BasicAuthRestTemplate template = new BasicAuthRestTemplate(httpUsername, httpPassword);

        ResIterator resIterator = model.listResourcesWithProperty(DCTerms.spatial);
        resIterator.forEachRemaining(datasetResource -> {
            datasetResource.listProperties(DCTerms.spatial).forEachRemaining(spatial -> {

                String uri = null;
                if(spatial.getObject().isResource()) {
                    uri = AbstractBuilder.removeDefaultBaseUri(model, spatial.getObject().asResource().getURI());
                } else {
                    //Workaround to handle resource URI on the form <dct:spatial>someurl</dct:spatial>
                    uri = spatial.getLiteral().getString();
                }

                if (uri != null && uri.startsWith("http")) {
                    if (existingLocationCodes == null || !existingLocationCodes.containsKey(uri)) {

                        postLocationToReferenceData(template, uri);
                    }
                }
            });
        });
    }

    public void postLocationToReferenceData(BasicAuthRestTemplate template, String uri) {
        LocationUri locationUri = new LocationUri(uri);

        try {
            SkosCode skosCode = template.postForObject(referenceDataUrl + "/locations/", locationUri, SkosCode.class);
            locations.put(skosCode.getUri(), skosCode);
            logger.info("Posting location to reference-data: {}", skosCode.toString());
        } catch (Exception e) {
            logger.error("Error posting location [{}] to reference-data service. Reason {}", locationUri.getUri(), e.getLocalizedMessage());
        }
    }


    public List<SkosCode> getLocations(List<String> strings) {
        return strings.stream()
                .map(locations::get)
                .distinct()
                .collect(Collectors.toList());

    }
}
