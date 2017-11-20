package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.harvester.crawler.CrawlerJob;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.dcat.Publisher;
import no.difi.dcat.datastore.domain.dcat.builders.PublisherBuilder;
import org.apache.jena.rdf.model.Model;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.Client;
import org.junit.Rule;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

/**
 * Class for testing ElasticSearchResultPubHandler.
 */
public class ElasticSearchResultPubHandlerTest {
    private static Logger logger = LoggerFactory.getLogger(ElasticSearchResultPubHandlerTest.class);

    private static String expected = "index {[dcat][publisher][983887457], source[{\n  \"overordnetEnhet\": \"814716872\",\n  \"organisasjonsform\": \"ORGL\",\n  \"uri\": \"http://data.brreg.no/enhetsregisteret/enhet/983887457\",\n  \"id\": \"983887457\",\n  \"name\": \"BR\"\n}]}";

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
