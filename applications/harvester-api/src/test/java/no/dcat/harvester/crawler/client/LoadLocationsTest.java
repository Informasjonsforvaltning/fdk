package no.dcat.harvester.crawler.client;


import no.difi.dcat.datastore.Elasticsearch;
import org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsResponse;
import org.mockito.Mockito;

import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Class for testing LoadLocations.
 */
public class LoadLocationsTest {

    Elasticsearch elasticsearch = mock(Elasticsearch.class, RETURNS_DEEP_STUBS);
    IndicesExistsResponse mock = mock(IndicesExistsResponse.class, RETURNS_DEEP_STUBS);

    {
        when(elasticsearch.getClient().admin().indices().prepareExists(Mockito.anyString()).get()).thenReturn(mock);
    }

//    @Test
//    public void loadLocationTest() {
//
//
//        Model model = FileManager.get().loadModel("rdf/dataset-w-distribution.ttl");
//
//        LoadLocations loadLocations = new LoadLocations("http://localhost:8100", "user", "password");
//        loadLocations.addLocationsToThemes(model);
//
//        assertEquals("Number of locations", 3, loadLocations.locations.size());
//        assertEquals("Norway", new HashMap<>(), loadLocations.locations.get("http://sws.geonames.org/3144096/").getPrefLabel());
//    }


//    @Test
//    public void retrieveLocationTitleDoesNotFailOnValidURL() throws Throwable {
//        final String url = "http://79.125.104.140/bym/rest/services/Temadata_Publikum/MapServer";
//
//
////        when(elasticsearch.getClient().admin().indices().prepareExists(Mockito.anyString()).get().isExists()).thenReturn(true);
//        LoadLocations lc = new LoadLocations(elasticsearch);
//
//        Map<String, SkosCode> locations = new HashMap<>();
//        SkosCode code = new SkosCode(url, null, new HashMap<>());
//        locations.put(url, code);
//        lc.locations = locations;
//
//        LoadLocations actual = lc.retrieveLocTitle();
//
//        assertThat(actual.getLocations().get(url).getPrefLabel().isEmpty(), Matchers.is(true));
//
//    }


}
