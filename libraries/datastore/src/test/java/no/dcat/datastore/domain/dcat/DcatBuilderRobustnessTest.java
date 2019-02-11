package no.dcat.datastore.domain.dcat;

import com.google.common.io.CharStreams;
import com.google.gson.Gson;
import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.dcat.datastore.domain.dcat.builders.DcatReader;
import no.dcat.datastore.domain.dcat.smoke.TestCompleteCatalog;
import no.dcat.shared.Catalog;
import no.dcat.shared.Contact;
import no.dcat.shared.Dataset;
import no.dcat.shared.QualityAnnotation;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.util.*;

import static org.hamcrest.Matchers.startsWith;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.*;


@Category(UnitTest.class)
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

        doThrow(NullPointerException.class).when(builderSpy).addSubjects(any(), any(), any());

        String actual = builderSpy.addCatalog(catalog).getDcatOutput("TURTLE");

        assertThat(actual, is(notNullValue()));
    }

    @Test
    public void exceptionInAddPublisher() throws Throwable {
        DcatBuilder builderSpy = spy(builder);

        doThrow(NullPointerException.class).when(builderSpy).addLiteral(any(), eq(FOAF.name), any());

        String actual = builderSpy.addCatalog(catalog).getDcatOutput("TURTLE");

        assertThat(actual, is(notNullValue()));
    }


    // disRes.addProperty(RDF.type, org.apache.jena.vocabulary.DCAT.Distribution);
    @Test
    public void exceptionInAddDistribution() throws Throwable {
        DcatBuilder builderSpy = spy(builder);

        doThrow(NullPointerException.class).when(builderSpy).addSkosConcept(any(), eq(DCTerms.license), any(), any());

        String actual = builderSpy.addCatalog(catalog).getDcatOutput("TURTLE");

        assertThat(actual, is(notNullValue()));
    }

    @Test
    public void loadJoachimsDatasetThatBreaksRDFXML() throws Throwable {
        DcatBuilder builderSpy = new DcatBuilder();

        ClassPathResource resource = new ClassPathResource("ramsund.json");
        String datasetJson = CharStreams.toString(new InputStreamReader(resource.getInputStream(), "utf-8"));
        Dataset dataset = new Gson().fromJson(datasetJson, Dataset.class);

        builderSpy.addDataset(dataset);

        String actual = builderSpy.getDcatOutput("RDFXML");

        logger.debug(actual);

        assertThat("rdf/xml now works", actual, is(notNullValue()));
        assertThat(actual, startsWith("<rdf:RDF"));
        assertThat(actual, containsString("<dct:title xml:lang=\"nb\">Ramsunds begrepsregister</dct:title>"));
        //assertThat(actual, endsWith("</rdf:RDF>"));
    }

    @Test
    public void forceDifferentContactsWithSameUriToGenerateUniqueContactsInDcat() throws Throwable {

        // shared contact
        Contact c3 = new Contact();
        c3.setUri("http://extern.url/kontaktpunkt1");
        c3.setFullname("shared");

        // contact without uri
        Contact c4 = new Contact();
        c4.setFullname("null-uri");

        Dataset d1 = new Dataset();
        d1.setUri("http://dataset1");
        Contact c1 = new Contact();
        c1.setUri("http://extern.url/kontaktpunkt1");
        c1.setFullname("alpha");
        d1.setContactPoint(Arrays.asList(c1, c3));

        Dataset d2 = new Dataset();
        d2.setUri("http://dataset2");
        Contact c2 = new Contact();
        c2.setUri("http://extern.url/kontaktpunkt1");
        c2.setFullname("beta");
        d2.setContactPoint(Arrays.asList(c2, c3, c4));

        Catalog c = new Catalog();
        c.setUri("http://catalog1");
        c.setDataset(Arrays.asList(d1, d2));

        DcatBuilder builder = new DcatBuilder();
        builder.addCatalog(c);

        String dcat = builder.getDcatOutput("TURTLE");

        logger.debug(dcat);

        Model model = ModelFactory.createDefaultModel();
        model.read(new ByteArrayInputStream(dcat.getBytes()), null, "TTL");

        DcatReader reader = new DcatReader(model);

        List<Dataset> actualDatasets = reader.getDatasets();

        final Set<Contact> contacts = new HashSet<>();
        actualDatasets.forEach(dataset -> {
            logger.debug("ds: {}", dataset.getUri());
            dataset.getContactPoint().forEach(cp -> {
                logger.debug("cp: {}", cp.toString());
                contacts.add(cp);
            });
        });

        assertThat(contacts.size(), is(4));


    }

    @Test
    public void checkAccuracyEncoding() throws Throwable {

        Dataset dataset = new Dataset();

        dataset.setUri("http://data.example.org/dataset/1");

        QualityAnnotation qualityAnnotation = new QualityAnnotation();
        qualityAnnotation.setInDimension("iso:Accuracy");
        Map<String, String> x = new HashMap<>();
        x.put("no", "nøyaktighet");
        qualityAnnotation.setHasBody(x);
        qualityAnnotation.setMotivatedBy("me self");

        dataset.setHasAccuracyAnnotation(qualityAnnotation);

        Catalog catalog = new Catalog();
        catalog.setUri("http://data.example.org/catalog/1");
        catalog.setDataset(Arrays.asList(dataset));

        String result = DcatBuilder.transform(catalog, "TURTLE");

        logger.info(result);
    }

}
