package no.dcat.harvester.crawler;


import no.dcat.datastore.domain.DcatSource;
import no.fdk.test.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URL;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

/**
 * Class for testing CrawlerPublisherJob.
 */
@Category(UnitTest.class)
public class CrawlerPublisherJobTest {
    private static Logger logger = LoggerFactory.getLogger(CrawlerPublisherJobTest.class);


    @Test
    public void testThatHandlerIsInvoked() {


        CrawlerResultHandler handler = Mockito.mock(CrawlerResultHandler.class);
        Mockito.doNothing().when(handler).process(any(), any(), any());

        URL url = getClass().getClassLoader().getResource("datasett-mini.ttl");
        DcatSource dcatSource = new DcatSource("http//dcat.no/test", "Test", url.toString(), "admin_user", "123456789");

        CrawlerPublisherJob j = new CrawlerPublisherJob(dcatSource, null, handler);

        j.run();

        verify(handler).process(any(), any(), any());
    }

}
