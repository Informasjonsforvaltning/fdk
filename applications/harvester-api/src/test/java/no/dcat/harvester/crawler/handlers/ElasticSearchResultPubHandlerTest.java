package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.difi.dcat.datastore.domain.dcat.Publisher;
import org.elasticsearch.action.index.IndexRequest;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Class for testing ElasticSearchResultPubHandler.
 */
public class ElasticSearchResultPubHandlerTest {
    private static String result = "index {[dcat][publisher][http://data.brreg.no/enhetsregisteret/enhet/983887457], source[{\n" +
            "  \"overordnetEnhet\": \"814716872\",\n" +
            "  \"organisasjonsform\": \"ORGL\",\n" +
            "  \"subPublisher\": [],\n" +
            "  \"aggrSubPublisher\": [],\n" +
            "  \"id\": \"http://data.brreg.no/enhetsregisteret/enhet/983887457\",\n" +
            "  \"name\": \"BR\"\n" +
            "}]}";
    @Test
    public void test() {
        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();
        ElasticSearchResultPubHandler handler = new ElasticSearchResultPubHandler(null, 0, null);

        String pudlisherUri = "http://data.brreg.no/enhetsregisteret/enhet/983887457";
        String organisasjonsform    = "ORGL";
        String overordnetEnhet     = "814716872";
        String name     = "BR";

        Publisher publisher = new Publisher();
        publisher.setOrganisasjonsform(organisasjonsform);
        publisher.setOverordnetEnhet(overordnetEnhet);
        publisher.setName(name);
        publisher.setId(pudlisherUri);

        IndexRequest index = handler.addPublisherToIndex(gson, publisher);

        assertEquals(result, index.toString());
    }
}
