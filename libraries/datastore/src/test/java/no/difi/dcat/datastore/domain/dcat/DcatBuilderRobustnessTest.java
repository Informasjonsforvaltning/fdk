package no.difi.dcat.datastore.domain.dcat;

import com.google.common.io.CharStreams;
import com.google.gson.Gson;
import no.dcat.shared.Catalog;
import no.dcat.shared.Dataset;
import no.difi.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.difi.dcat.datastore.domain.dcat.smoke.TestCompleteCatalog;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.ClassPathResource;
import sun.misc.IOUtils;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

public class DcatBuilderRobustnessTest {

    static Logger logger = LoggerFactory.getLogger(DcatBuilderRobustnessTest.class);

    DcatBuilder builder;
    Catalog catalog;

    @Before
    public void setUp() {
        builder = new DcatBuilder();
        catalog = TestCompleteCatalog.getCompleteCatalog();
        builder.addCatalog(catalog);
    }


    @Test
    public void exceptionInAddDataset() throws Throwable {

        DcatBuilder builderSpy = spy(builder);

        doThrow(NullPointerException.class).when(builderSpy).addSubjects(anyObject(), anyObject(), anyObject());

        String actual = builderSpy.addCatalog(catalog).getDcatOutput("TURTLE");

        assertThat(actual, is(notNullValue()));
    }

    @Test
    public void exceptionInAddPublisher() throws Throwable {
        DcatBuilder builderSpy = spy(builder);

        doThrow(NullPointerException.class).when(builderSpy).addLiteral(anyObject(), eq(FOAF.name), anyObject());

        String actual = builderSpy.addCatalog(catalog).getDcatOutput("TURTLE");

        assertThat(actual, is(notNullValue()));
    }


    // disRes.addProperty(RDF.type, org.apache.jena.vocabulary.DCAT.Distribution);
    @Test
    public void exceptionInAddDistribution() throws Throwable {
        DcatBuilder builderSpy = spy(builder);

        doThrow(NullPointerException.class).when(builderSpy).addSkosConcept(anyObject(), eq(DCTerms.license), anyObject(), anyObject());

        String actual = builderSpy.addCatalog(catalog).getDcatOutput("TURTLE");

        assertThat(actual, is(notNullValue()));
    }

    @Test
    public void loadJoachimsDatasetThatBreaksRDFXML() throws Throwable {
        DcatBuilder builderSpy = builder ; //spy(builder);
        ClassPathResource resource = new ClassPathResource("ramsund.json");
        String datasetJson = CharStreams.toString(new InputStreamReader(resource.getInputStream(),"utf-8"));
        Dataset dataset = new Gson().fromJson(datasetJson, Dataset.class);

        builderSpy.addDataset(dataset);

        String out = builderSpy.getDcatOutput("TURTLE");
        logger.info(out);
        assertThat(out, is(notNullValue()));


    }
}
