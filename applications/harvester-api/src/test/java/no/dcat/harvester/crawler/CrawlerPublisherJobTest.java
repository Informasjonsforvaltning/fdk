package no.dcat.harvester.crawler;


import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import no.dcat.harvester.HarvesterApplication;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Matchers.anyObject;
import static org.mockito.Mockito.verify;
import static org.junit.Assert.*;
import static org.hamcrest.Matchers.*;

/**
 * Class for testing CrawlerPublisherJob.
 */
public class CrawlerPublisherJobTest {
    private static Logger logger = LoggerFactory.getLogger(CrawlerPublisherJobTest.class);


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

}