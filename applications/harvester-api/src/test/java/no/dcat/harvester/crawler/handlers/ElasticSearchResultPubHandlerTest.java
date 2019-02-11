package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.datastore.domain.dcat.Publisher;
import no.fdk.test.testcategories.UnitTest;
import org.elasticsearch.action.index.IndexRequest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;

/**
 * Class for testing ElasticSearchResultPubHandler.
 */
@Category(UnitTest.class)
public class ElasticSearchResultPubHandlerTest {
    private static Logger logger = LoggerFactory.getLogger(ElasticSearchResultPubHandlerTest.class);


    Gson gson;
    ElasticSearchResultPubHandler handler;

    @Before
    public void setup() {
        gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();
        handler = new ElasticSearchResultPubHandler(null, null);
    }

    @Test
    public void addPublisherToIndexOK() {

        String pudlisherUri = "http://data.brreg.no/enhetsregisteret/enhet/983887457";
        String organisasjonsform = "ORGL";
        String overordnetEnhet = "814716872";
        String name = "BR";

        Publisher publisher = new Publisher();
        publisher.setOrganisasjonsform(organisasjonsform);
        publisher.setOverordnetEnhet(overordnetEnhet);
        publisher.setName(name);
        publisher.setUri(pudlisherUri);
        publisher.setId("983887457");

        final String expected = "index {[dcat][publisher][983887457], source[{\n  \"overordnetEnhet\": \"814716872\",\n  \"organisasjonsform\": \"ORGL\",\n  \"valid\": false,\n  \"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/983887457\",\n  \"id\": \"983887457\",\n  \"name\": \"BR\"\n}]}";


        IndexRequest actual = handler.addPublisherToIndex(gson, publisher);

        assertThat(actual.toString(), is(expected));
    }

    @Test
    public void addPublisherWithoutId() {
        Publisher publisher = new Publisher();
        publisher.setOrganisasjonsform("ORGL");
        publisher.setUri("http://data.brreg.no/enhetsregisteret/enhet/983887457");

        final String expected = "index {[dcat][publisher][983887457], source[{\n  \"organisasjonsform\": \"ORGL\",\n  \"valid\": false,\n  \"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/983887457\",\n  \"id\": \"983887457\"\n}]}";

        assertThat(publisher.getId(), is(nullValue()));

        IndexRequest actual = handler.addPublisherToIndex(gson, publisher);

        assertThat(publisher.getId(), is("983887457"));
        assertThat(actual.toString(), is(expected));
    }

    @Test
    public void addPublisherWithoutOrgNumberInUri() {
        Publisher publisher = new Publisher();
        publisher.setOrganisasjonsform("ORGL");
        publisher.setUri("http://some/other/uri");

        IndexRequest actual = handler.addPublisherToIndex(gson, publisher);

        assertThat(publisher.getId(), is("http://some/other/uri"));
    }


}
