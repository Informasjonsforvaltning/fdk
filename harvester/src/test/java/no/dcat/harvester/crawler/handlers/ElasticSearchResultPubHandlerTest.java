package no.dcat.harvester.crawler.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.harvester.dcat.domain.theme.builders.vocabulary.EnhetsregisteretRDF;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.elasticsearch.action.index.IndexRequest;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Class for testing ElasticSearchResultPubHandler.
 */
public class ElasticSearchResultPubHandlerTest {
    private static String result = "index {[dcat][publisher][http://data.brreg.no/enhetsregisteret/enhet/983887457], source[{\n" +
            "  \"id\": \"http://data.brreg.no/enhetsregisteret/enhet/983887457\",\n" +
            "  \"name\": \"BR\",\n" +
            "  \"overordnetEnhet\": \"814716872\",\n" +
            "  \"organisasjonsform\": \"ORGL\",\n" +
            "  \"subPublisher\": [],\n" +
            "  \"aggrSubPublisher\": []\n" +
            "}]}";
    @Test
    public void test() {
        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssX").create();
        ElasticSearchResultPubHandler handler = new ElasticSearchResultPubHandler(null, 0, null);

        String pudlisherUri = "http://data.brreg.no/enhetsregisteret/enhet/983887457";
        String organisasjonsform    = "ORGL";
        String overordnetEnhet     = "814716872";
        String name     = "BR";

        Model model = ModelFactory.createDefaultModel();

        Resource publisher = model.createResource(pudlisherUri);

        publisher.addProperty(EnhetsregisteretRDF.organisasjonsform, organisasjonsform);
        publisher.addProperty(EnhetsregisteretRDF.overordnetEnhet, overordnetEnhet);
        publisher.addProperty(FOAF.name, name);

        IndexRequest index = handler.extractAndCreatePublisher(gson, publisher);

        assertEquals(result, index.toString());
    }
}
