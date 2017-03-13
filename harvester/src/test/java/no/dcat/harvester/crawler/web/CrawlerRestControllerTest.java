package no.dcat.harvester.crawler.web;

import no.difi.dcat.datastore.domain.DcatSource;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.HashMap;

import static org.mockito.Mockito.*;

/**
 * Created by dask on 03.03.2017.
 */
//@RunWith(SpringRunner.class)
public class CrawlerRestControllerTest {


    CrawlerRestController crawlerController;
    @Before
    public void setup() {
        crawlerController = new CrawlerRestController();

    }

    /**
     * Test that empty list of empty dcat sources actually runs
     *
     * @throws Throwable
     */
    @Test
    public void harvestAll() throws Throwable {
        CrawlerRestController spy = spy(crawlerController);
        doNothing().when(spy).harvestAllCodes(true);
        doReturn(new ArrayList<DcatSource>()).when(spy).getDcatSources();

        spy.harvestAllDcatSources();
    }


}
