package no.dcat.harvester.crawler.handlers;

import no.dcat.data.store.Elasticsearch;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.elasticsearch.action.ListenableActionFuture;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.client.Client;
import org.junit.Test;

import java.io.File;
import java.io.IOException;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Class for testing CodeCrawlerHandler.
 */
public class CodeCrawlerHandlerTest {

    private Elasticsearch es = mock(Elasticsearch.class);
    private BulkRequestBuilder rb = mock(BulkRequestBuilder.class);
    private Client client = mock(Client.class);
    private BulkResponse br = mock(BulkResponse.class);
    private ListenableActionFuture laf = mock(ListenableActionFuture.class);

    @Test
    public void testHandlerSuccesfullCal() throws IOException {

        final Model model = createModel();
        CodeCrawlerHandler h = new CodeCrawlerHandler("localhost",9300,"elasticsearch","provinance", true);

        when(es.getClient()).thenReturn(client);
        when(client.prepareBulk()).thenReturn(rb);
        when(rb.execute()).thenReturn(laf);
        when(laf.actionGet()).thenReturn(br);

        h.indexWithElasticsearch(null, model, es);

        verify(laf).actionGet();
    }

    @Test(expected = RuntimeException.class)
    public void testHandlerNotSuccesfullCal() throws IOException {

        final Model model = createModel();
        CodeCrawlerHandler h = new CodeCrawlerHandler("localhost",9300,"elasticsearch","provinance", true);

        when(es.getClient()).thenReturn(client);
        when(client.prepareBulk()).thenReturn(rb);
        when(rb.execute()).thenReturn(laf);
        when(laf.actionGet()).thenReturn(br);
        when(br.hasFailures()).thenReturn(true);

        h.indexWithElasticsearch(null, model, es);
    }

    private Model createModel() throws IOException {
        String defultPath = new File(".").getCanonicalPath().toString();
        String fileWithPath = String.format("file:%s/src/test/resources/rdf/%s", defultPath, "provenance.rdf");

        final Model model = ModelFactory.createDefaultModel();
        model.read(fileWithPath);
        return model;
    }
}
