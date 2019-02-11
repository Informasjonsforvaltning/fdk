package no.dcat.datastore.domain.dcat.builders;

import no.dcat.datastore.domain.dcat.smoke.TestCompleteCatalog;
import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import no.dcat.shared.*;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;


@Category(UnitTest.class)
public class AbstractBuilderTest {
    private static Logger logger = LoggerFactory.getLogger(AbstractBuilderTest.class);

    private static Model model;
    private static Resource datasetResource;

    @BeforeClass
    public static void setup() throws Throwable {
        Catalog catalog = TestCompleteCatalog.getCompleteCatalog();

        DcatBuilder builder = new DcatBuilder();
        String dcat = builder.transform(catalog, "TURTLE");

        model = ModelFactory.createDefaultModel();
        model.read(new ByteArrayInputStream(dcat.getBytes()), "", "TTL");

        ResIterator resourceIterator = model.listResourcesWithProperty(RDF.type, DCAT.Dataset);

        while (resourceIterator.hasNext()) {
            Resource resource = resourceIterator.next();
            if (resource.getURI() != null) {
                datasetResource = resource;
                logger.info("Resource to test: {}", resource.getURI());

            }
        }
    }

    @Test
    public void extractContacts() throws Throwable {
        List<Contact> contacts = AbstractBuilder.extractContacts(datasetResource);
        assertThat("Only two contacts in dataset", contacts.size(), is(2));

    }

    @Test
    public void extractReferences() throws Throwable {

        List<Reference> references = AbstractBuilder.extractReferences(datasetResource, null);

        assertThat("Dataset has one reference", references.size(), is(1));
    }

    @Test
    public void extractPeriodOfTime() throws Throwable {
        List<PeriodOfTime> temporals = AbstractBuilder.extractPeriodOfTime(datasetResource);

        assertThat("Dataset has two period of times", temporals.size(), is(2));
    }

    @Test
    public void extractSkosConcept() throws Throwable {
        List<SkosConcept> concepts = AbstractBuilder.extractSkosConcept(datasetResource, DCATNO.informationModel);

        assertThat("Dataset informationModel has one concept", concepts.size(), is(1));
    }

    /**
     * Test that empty skos:prefLabels, e.g. ""@nb is ignored, while non empty are interpreted
     */
    @Test
    public void extractEmptySkosConcept() throws Throwable {

        org.springframework.core.io.Resource emptyLicenses = new ClassPathResource("rdf/DcatWithEmptyLicenses.ttl");

        Model model = ModelFactory.createDefaultModel();
        model.read(emptyLicenses.getInputStream(), "", "TTL");

        Resource resource = model.getResource("http://catalog");

        List<SkosConcept> concepts = AbstractBuilder.extractSkosConcept(resource, DCTerms.license);

        assertThat(concepts.size(), is(1));

        assertThat("Empty prefLables are ignored", concepts.get(0).getPrefLabel(), is(nullValue()));

        resource = model.getResource("http:/distributions/d2");

        concepts = AbstractBuilder.extractSkosConcept(resource, DCTerms.license);

        assertThat(concepts.size(), is(1));

        assertThat(concepts.get(0).getPrefLabel(), is(notNullValue()));

        assertThat("Only non empty prefLabels should be read", concepts.get(0).getPrefLabel().get("nb"), is("Norsk"));
    }

    @Test
    public void getCodesFail1() throws Throwable {

        List<SkosCode> codes = AbstractBuilder.getCodes(model, null, AbstractBuilder.extractMultipleStrings(datasetResource, DCTerms.language));

        assertThat("get codes with no locations fails", codes, is(nullValue()));
    }

    @Test
    public void getCodes() throws Throwable {
        SkosCode norCode = new SkosCode();
        norCode.setCode("NOR");
        norCode.setUri("http://publications.europa.eu/resource/authority/language/NOR");
        norCode.setPrefLabel(new HashMap<>());
        norCode.getPrefLabel().put("no", "Norsk");

        SkosCode engCode = new SkosCode("http://publications.europa.eu/resource/authority/language/ENG", "ENG", new HashMap<>());
        engCode.getPrefLabel().put("no", "Engelsk");

        Map<String, SkosCode> codeMap = new HashMap<>();
        codeMap.put(norCode.getUri(), norCode);
        codeMap.put(engCode.getUri(), engCode);

        List<SkosCode> codes = AbstractBuilder.getCodes(model, codeMap, AbstractBuilder.extractMultipleStrings(datasetResource, DCTerms.language));

        assertThat("Dataset has two language codes", codes.size(), is(2));
    }


}
