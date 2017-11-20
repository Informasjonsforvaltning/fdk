package no.dcat.harvester.crawler;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.harvester.HarvesterApplication;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultPubHandler;
import no.difi.dcat.datastore.Elasticsearch;
import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.datastore.domain.dcat.Publisher;
import no.difi.dcat.datastore.domain.dcat.builders.PublisherBuilder;
import org.apache.jena.rdf.model.Model;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.client.Client;
import org.junit.Rule;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.net.URL;
import java.util.List;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Class for testing CrawlerPublisherJob.
 */
public class CrawlerPublisherJobTest {
    private static Logger logger = LoggerFactory.getLogger(CrawlerPublisherJobTest.class);


    @Mock
    Elasticsearch elasticsearch;

    @Mock
    Client client;

    @Mock
    BulkRequestBuilder bulkRequestBuilder;

    @Rule
    public MockitoRule mockitoRule = MockitoJUnit.rule();

    @Test
    public void testThatHandlerIsInvoked() {


        CrawlerResultHandler handler = Mockito.mock(CrawlerResultHandler.class);
        Mockito.doNothing().when(handler).process(anyObject(), anyObject(), anyObject());

        URL url = getClass().getClassLoader().getResource("datasett-mini.ttl");
        DcatSource dcatSource = new DcatSource("http//dcat.no/test", "Test", url.toString(), "admin_user", "123456789");

        CrawlerPublisherJob j = new CrawlerPublisherJob(dcatSource, null, HarvesterApplication.getBrregCache(), handler);

        j.run();

        verify(handler).process(anyObject(), anyObject(), anyObject());
    }

    @Test
    public void orgPathOK () throws Throwable {
        Resource r = new ClassPathResource("organizations.ttl");
        ElasticSearchResultPubHandler handler = new ElasticSearchResultPubHandler(null, 0, null);
        when(elasticsearch.getClient()).thenReturn(client);
        when(client.prepareBulk()).thenReturn(bulkRequestBuilder);
        ElasticSearchResultPubHandler handlerSpy = spy(handler);
        //when(handlerSpy.lookupPublisher(any(), anyString(), any())).thenReturn(null);
        doReturn(null).when(handlerSpy).lookupPublisher(any(), anyString(), any());

        Model model = new CrawlerJob(null,null,HarvesterApplication.getBrregCache(), null).loadModelAndValidate(r.getURL());

        model.write(System.out, "TURTLE");


        List<Publisher> publishers = new PublisherBuilder(model).build();
        Gson gson = new GsonBuilder().setPrettyPrinting().setDateFormat("yyyy-MM-dd'T'HH:mm:ssZ").create();


        handlerSpy.generateOrganizationPath(elasticsearch, publishers, gson);

        publishers.forEach(publisher -> {
            logger.info("orgnr: {} -> {}, {} {}", publisher.getId(), publisher.getOrgPath(), publisher.getName(), publisher.getNaeringskode());
        });

    }

}