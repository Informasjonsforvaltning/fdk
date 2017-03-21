package no.dcat.portal.webapp;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.riot.RDFDataMgr;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.spy;

/**
 * Created by dask on 20.03.2017.
 */
public class PortalRestControllerTest {
    private static Logger logger = LoggerFactory.getLogger(PortalRestControllerTest.class);

    private PortalRestController portal;

    @Before
    public void setup() {
        portal = new PortalRestController();
    }


    @Test
    public void getCatalogDcatOk() throws Throwable {
        PortalRestController spy = spy(portal);
        doReturn("DCAT format").when(spy).findResourceById(anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
                "ttl", "text/turtle");

        assertThat(response.getStatusCode(), is(HttpStatus.OK));
    }

    @Test
    public void getDatasetDcatFormatsOK() throws Throwable {
        PortalRestController spy = spy(portal);
        doReturn("DCAT format").when(spy).findResourceById(anyString(), anyString(), anyString());

        final String[] acHeaders = {"application/ld+json", "json", "ld+json", "application/rdf+xml", "rdf", "text/turtle", "turtle"};
        for (String ac : acHeaders) {
            ResponseEntity<String> response = spy.getDatasetDcat("some id",
                    null, ac);
            assertThat(response.getStatusCode(), is(HttpStatus.OK));
        }

        final String[] formats = {"ttl", "xml", "rdf", "json", "jsonld"};
        for (String f : formats) {
            ResponseEntity<String> response = spy.getDatasetDcat("some id",
                    f, null);
            assertThat(response.getStatusCode(), is(HttpStatus.OK));
        }
    }

    @Test
    public void getCatalogDcatWrongAcceptHeader() throws Throwable {
        PortalRestController spy = spy(portal);
        doReturn("DCAT format").when(spy).findResourceById(anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
                null, "XXXX");

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_ACCEPTABLE));
    }

    @Test
    public void getCatalogDcatWrongFormat() throws Throwable {
        PortalRestController spy = spy(portal);
        doReturn("DCAT format").when(spy).findResourceById(anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
                "WRONG", null);

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_ACCEPTABLE));
    }


    @Test
    public void getCatalogDcatIdNotFound() throws Throwable {
        PortalRestController spy = spy(portal);
        doReturn(null).when(spy).findResourceById(anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
                null, "text/turtle");

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    public void getCatalogDcatIdThrowsNotFound() throws Throwable {
        PortalRestController spy = spy(portal);
        doThrow(new NoSuchElementException("NSEE")).when(spy).findResourceById(anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
                null, "application/ld+json");

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    public void findResourceByIdOK() throws Throwable {
        PortalRestController spy = spy(portal);
        Resource mResource = new ClassPathResource("data.ttl");
        org.apache.jena.query.Dataset dataset = RDFDataMgr.loadDataset(mResource.getURL().toString());
        Model model = ModelFactory.createUnion(ModelFactory.createDefaultModel(), dataset.getDefaultModel());

        //model.read(mResource.getInputStream(), "TURTLE");
        doReturn(model).when(spy).getModel();

        Resource queryResource = new ClassPathResource("sparql/catalog.sparql");
        String queryString = read(queryResource.getInputStream());

        String resultOK = spy.findResourceById("http://data.brreg.no/datakatalog/katalog/974761076/5",
                queryString,
                "text/turtle");

        assertThat(resultOK, not(nullValue()));

        String urlEncodedIdResult = spy.findResourceById("http%3A%2F%2Fdata.brreg.no%2Fdatakatalog%2Fkatalog%2F974761076%2F5",
                queryString, "text/turtle");

        assertThat(urlEncodedIdResult, not(nullValue()));
        boolean eq = urlEncodedIdResult.equals(resultOK);
        assertThat(true, is(eq));

        String resultNOTFOUND = spy.findResourceById("unknownid", queryString, "application/rdf+xml");

        assertThat(resultNOTFOUND, nullValue());

    }

    @Test
    public void exportDatasetFusekiNotFound() throws Throwable {
        PortalRestController spy = spy(portal);
        doReturn(null).when(spy).invokeFusekiQuery(anyString(), anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getDatasetDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
                null, "application/ld+json");

        assertThat(response.getStatusCode(), is(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @Test
    public void exportCatalogFusekiNotFound() throws Throwable {
        PortalRestController spy = spy(portal);
        doReturn(null).when(spy).invokeFusekiQuery(anyString(), anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
                null, "application/ld+json");

        assertThat(response.getStatusCode(), is(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @Test
    public void exportIOExceptionSparqlNotFound() throws Throwable {
        PortalRestController spy = spy(portal);

        ResponseEntity<String> response = spy.invokeFusekiQuery("http://data.brreg.no/datakatalog/katalog/974761076/5",
                null, "application/ld+json", "sparql/nofile.sparql");

        assertThat(response, nullValue());
    }

    private static String read(InputStream input) throws IOException {
        try (BufferedReader buffer = new BufferedReader(new InputStreamReader(input))) {
            return buffer.lines().collect(Collectors.joining("\n"));
        }
    }

}
