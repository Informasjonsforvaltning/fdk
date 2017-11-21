package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.difi.dcat.datastore.domain.dcat.Publisher;
import org.elasticsearch.action.index.IndexRequest;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

/**
 * Class for testing ElasticSearchResultPubHandler.
 */
public class ElasticSearchResultPubHandlerTest {
    private static Logger logger = LoggerFactory.getLogger(ElasticSearchResultPubHandlerTest.class);

    private static String expected = "index {[dcat][publisher][983887457], source[{\n  \"overordnetEnhet\": \"814716872\",\n  \"organisasjonsform\": \"ORGL\",\n  \"valid\": false,\n  \"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/983887457\",\n  \"id\": \"983887457\",\n  \"name\": \"BR\"\n}]}";

    @Test
    public void addPublisherToIndexOK() {
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
        publisher.setUri(pudlisherUri);
        publisher.setId("983887457");

        IndexRequest actual = handler.addPublisherToIndex(gson, publisher);

        assertThat(actual.toString(), is(expected));
    }


}
