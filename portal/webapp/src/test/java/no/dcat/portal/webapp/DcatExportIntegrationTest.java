package no.dcat.portal.webapp;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;

/**
 * Created by dask on 20.03.2017.
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class DcatExportIntegrationTest {

    private static Logger logger = LoggerFactory.getLogger(DcatExportIntegrationTest.class);

    private PortalRestController portal;

    @Before
    public void setup() {
        portal = new PortalRestController();
        // ReflectionTestUtils.setField(portal, "application.fusekiService", "http://localhost:3030/fuseki/dcat");
    }


    @Test
    public void getCatalogs() throws Throwable {

        PortalRestController spy = spy(portal);
        doReturn("http://localhost:3030/fuseki").when(spy).getFusekiService();

        ResponseEntity<String> result = spy.getCatalogs("text/html");

        logger.info(result.getBody());
    }

    @Test
    public void exportCatalogOK() throws Throwable {
        PortalRestController spy = spy(portal);
        doReturn("http://localhost:3030/fuseki").when(spy).getFusekiService();

        ResponseEntity<String> actual = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
                "ttl", "text/turtle");

        logger.debug(actual.getBody());
    }

    @Test
    public void exportDatasetOK() throws Throwable {
        PortalRestController spy = spy(portal);
        doReturn("http://localhost:3030/fuseki").when(spy).getFusekiService();

        ResponseEntity<String> actual = spy.getDatasetDcat("http://data.brreg.no/datakatalog/dataset/974761076/63",
                "ttl", "text/turtle");

        logger.debug(actual.getBody());
    }

}
