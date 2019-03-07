package no.fdk.searchapi.controller;

import no.dcat.shared.Catalog;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.sparql.engine.http.QueryExceptionHTTP;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.mockito.Mockito;
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
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Created by dask on 20.03.2017.
 */
@Category(UnitTest.class)
public class CatalogControllerTest {
    private static Logger logger = LoggerFactory.getLogger(CatalogControllerTest.class);

    private CatalogController catalogController;

    private static String read(InputStream input) throws IOException {
        try (BufferedReader buffer = new BufferedReader(new InputStreamReader(input))) {
            return buffer.lines().collect(Collectors.joining("\n"));
        }
    }

    @Before
    public void setup() {
        catalogController = new CatalogController();
    }

    @Test
    public void getCatalogsOK() throws Throwable {
        CatalogController spy = Mockito.spy(catalogController);

        // Load testdatasett in model
        Resource mResource = new ClassPathResource("data.ttl");
        org.apache.jena.query.Dataset dataset = RDFDataMgr.loadDataset(mResource.getURL().toString());
        Model model = ModelFactory.createUnion(ModelFactory.createDefaultModel(), dataset.getDefaultModel());

        // trick controller to set up query without talking to fuseki
        Resource queryResource = new ClassPathResource("sparql/allcatalogs.sparql");
        String queryString = read(queryResource.getInputStream());
        QueryExecution qe = QueryExecutionFactory.create(QueryFactory.create(queryString), model);

        doReturn(qe).when(spy).getQueryExecution(any());

        ResponseEntity<String> response = spy.getCatalogs();

        assertThat(response.getBody().contains("/catalogs?id="), is(true));

    }

    @Test
    public void getAllCatalogsOK() throws Throwable {
        CatalogController spy = Mockito.spy(catalogController);

        // Load testdatasett in model
        Resource mResource = new ClassPathResource("data.ttl");
        org.apache.jena.query.Dataset dataset = RDFDataMgr.loadDataset(mResource.getURL().toString());
        Model model = ModelFactory.createUnion(ModelFactory.createDefaultModel(), dataset.getDefaultModel());

        // trick controller to set up query without talking to fuseki
        Resource queryResource = new ClassPathResource("sparql/allcatalogs.sparql");
        String queryString = read(queryResource.getInputStream());
        QueryExecution qe = QueryExecutionFactory.create(QueryFactory.create(queryString), model);

        doReturn(qe).when(spy).getQueryExecution(any());

        List<Catalog> response = spy.allCatalogs();

        assertThat(response, is(notNullValue()));
        assertThat(response.size(), is(1));

    }

    @Test
    public void getCatalogsFailsOnIOError() throws Throwable {
        CatalogController spy = Mockito.spy(catalogController);

        doThrow(new IOException("force exception")).when(spy).read(any());

        ResponseEntity<String> response = spy.getCatalogs();

        assertThat(response.getStatusCode(), is(HttpStatus.INTERNAL_SERVER_ERROR));

    }

    @Test
    public void getCatalogsFailsOnNoCatalogsFound() throws Throwable {
        CatalogController spy = Mockito.spy(catalogController);

        // read modelfile with no catalog in
        Resource mResource = new ClassPathResource("data-no-catalog.ttl");
        org.apache.jena.query.Dataset dataset = RDFDataMgr.loadDataset(mResource.getURL().toString());
        Model model = ModelFactory.createUnion(ModelFactory.createDefaultModel(), dataset.getDefaultModel());

        // trick controller to use the query execution
        Resource queryResource = new ClassPathResource("sparql/allcatalogs.sparql");
        String queryString = read(queryResource.getInputStream());
        QueryExecution qe = QueryExecutionFactory.create(QueryFactory.create(queryString), model);
        doReturn(qe).when(spy).getQueryExecution(any());

        // do call
        ResponseEntity<String> response = spy.getCatalogs();

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_FOUND));

    }

    @Test
    public void getCatalogDcatOk() {
        CatalogController spy = Mockito.spy(catalogController);
        doReturn("DCAT format").when(spy).findResourceById(anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
            "ttl", "text/turtle");

        assertThat(response.getStatusCode(), is(HttpStatus.OK));
    }

    @Test
    public void getDatasetDcatFormatsOK() {
        CatalogController spy = Mockito.spy(catalogController);
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
    public void getCatalogDcatWrongAcceptHeader() {
        CatalogController spy = Mockito.spy(catalogController);
        doReturn("DCAT format").when(spy).findResourceById(anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
            null, "XXXX");

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_ACCEPTABLE));
    }

    @Test
    public void getCatalogDcatWrongFormat() {
        CatalogController spy = Mockito.spy(catalogController);
        doReturn("DCAT format").when(spy).findResourceById(anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
            "WRONG", null);

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_ACCEPTABLE));
    }

    @Test
    public void getCatalogDcatIdNotFound() {
        CatalogController spy = Mockito.spy(catalogController);
        doReturn(null).when(spy).findResourceById(anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
            null, "text/turtle");

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    public void getCatalogDcatIdThrowsNotFound() {
        CatalogController spy = Mockito.spy(catalogController);
        doThrow(new NoSuchElementException("NSEE")).when(spy).findResourceById(anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
            null, "application/ld+json");

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    public void findResourceByIdOK() throws Throwable {
        CatalogController spy = Mockito.spy(catalogController);
        Resource mResource = new ClassPathResource("data.ttl");
        org.apache.jena.query.Dataset dataset = RDFDataMgr.loadDataset(mResource.getURL().toString());
        Model model = ModelFactory.createUnion(ModelFactory.createDefaultModel(), dataset.getDefaultModel());

        Resource queryResource = new ClassPathResource("sparql/catalog.sparql");
        String queryString = read(queryResource.getInputStream());

        //model.read(mResource.getInputStream(), "TURTLE");
        String id = "http://data.brreg.no/datakatalog/katalog/974761076/5";
        Query q = QueryFactory.create(String.format(queryString, id));
        QueryExecution qe = QueryExecutionFactory.create(q, model);
        doReturn(q).when(spy).getQuery(anyString());
        doReturn(qe).when(spy).getQueryExecution(q);

        String resultOK = spy.findResourceById(id,
            queryString,
            "text/turtle");

        assertThat(resultOK, not(nullValue()));
    }

    @Test
    public void findResourceWithunknownIdReturnsNull() throws Throwable {
        CatalogController spy = Mockito.spy(catalogController);
        Resource mResource = new ClassPathResource("data.ttl");
        org.apache.jena.query.Dataset dataset = RDFDataMgr.loadDataset(mResource.getURL().toString());
        Model model = ModelFactory.createUnion(ModelFactory.createDefaultModel(), dataset.getDefaultModel());

        Resource queryResource = new ClassPathResource("sparql/catalog.sparql");
        String queryString = read(queryResource.getInputStream());

        //model.read(mResource.getInputStream(), "TURTLE");
        String id = "unknownid";
        Query q = QueryFactory.create(String.format(queryString, id));
        QueryExecution qe = QueryExecutionFactory.create(q, model);
        doReturn(q).when(spy).getQuery(anyString());
        doReturn(qe).when(spy).getQueryExecution(q);

        String resultNOTFOUND = spy.findResourceById(id, queryString, "application/rdf+xml");

        assertThat(resultNOTFOUND, nullValue());
    }

    @Test
    public void exportDatasetFusekiNotFound() {
        CatalogController spy = Mockito.spy(catalogController);
        doReturn(null).when(spy).invokeFusekiQuery(anyString(), anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getDatasetDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
            null, "application/ld+json");

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    public void exportCatalogFusekiNotFound() {
        CatalogController spy = Mockito.spy(catalogController);
        doReturn(null).when(spy).invokeFusekiQuery(anyString(), anyString(), anyString(), anyString());

        ResponseEntity<String> response = spy.getCatalogDcat("http://data.brreg.no/datakatalog/katalog/974761076/5",
            null, "application/ld+json");

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    public void invokeFusekiQueryThrowsExceptionSinceNoSparqlQueryFileIsFound() {
        CatalogController spy = Mockito.spy(catalogController);

        ResponseEntity<String> response = spy.invokeFusekiQuery("http://data.brreg.no/datakatalog/katalog/974761076/5",
            null, "application/ld+json", "sparql/nofile.sparql");

        assertThat(response, nullValue());
    }

    @Test
    public void invokeFusekiQueryThrowsExceptionbecauseOfIOErrorInFuseki() {
        CatalogController spy = Mockito.spy(catalogController);
        doThrow(new QueryExceptionHTTP(404, "force exception")).when(spy).getQueryExecution(any());

        ResponseEntity<String> response = spy.invokeFusekiQuery("http://data.brreg.no/datakatalog/katalog/974761076/5",
            null, "application/ld+json", "sparql/catalog.sparql");

        assertThat(response.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    public void getCatalogsThrowsExceptionBecauseOfIOErrorInFuseki() {
        CatalogController spy = Mockito.spy(catalogController);
        doThrow(new QueryExceptionHTTP(406, "force exception")).when(spy).getQueryExecution(any());

        ResponseEntity<String> response = spy.getCatalogs();

        assertThat(response.getStatusCode(), is(HttpStatus.INTERNAL_SERVER_ERROR));
    }

}
