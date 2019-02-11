package no.dcat.harvester.crawler.converters;

import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.rdf.model.*;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.hamcrest.Matchers;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;


@Category(UnitTest.class)
public class EnhetsregisterResolverTest {

    @Test
    public void testConvertBrregFileBlankNode() throws Exception {
        EnhetsregisterResolver enhetsregisterResolver = new EnhetsregisterResolver();

        Model model = FileManager.get().loadModel(EnhetsregisterResolverTest.class.getClassLoader().getResource("brreg/blankNodeTest.xml").getFile());

        enhetsregisterResolver.resolveModel(model);

        // this just tests that we can handle blank nodes
        // no assertion is made, just tests that there is no null pointer exception
    }

    @Test
    public void testMissingBrregFile() throws Exception {
        EnhetsregisterResolver enhetsregisterResolver = new EnhetsregisterResolver();

        Model model = ModelFactory.createDefaultModel();

        enhetsregisterResolver.collectEnhetsregisterInfoFromResource(model, model.createResource("http://test"));

        NodeIterator listObjectsOfProperty = model.listObjectsOfProperty(RDF.type);

        assertTrue("Expected empty model", listObjectsOfProperty.toList().isEmpty());
    }

    @Test
    public void testPreferredNameWithHitInCanonicalNames() {
        EnhetsregisterResolver enhetsregisterResolver = new EnhetsregisterResolver();

        Model model = ModelFactory.createDefaultModel();
        Resource publisher = model.createResource("http://publisheruri");

        enhetsregisterResolver.addPreferredOrganisationName(model, publisher, "889640782", "Arbeids og velferdsetaten");

        Statement prefLabelStmt = publisher.getProperty(SKOS.prefLabel);
        String actualLabel = prefLabelStmt.getObject().asLiteral().getString();

        assertThat(actualLabel, Matchers.is("Arbeids og velferdsetaten"));

    }

    @Test
    public void testPreferredNameWithNoHitInCanonicalNames() {
        EnhetsregisterResolver enhetsregisterResolver = new EnhetsregisterResolver();

        Model model = ModelFactory.createDefaultModel();
        Resource publisher = model.createResource("http://publisheruri");

        enhetsregisterResolver.addPreferredOrganisationName(model, publisher, "123", "Orginal navn");

        Statement prefLabelStmt = publisher.getProperty(SKOS.prefLabel);
        String actualLabel = prefLabelStmt.getObject().asLiteral().getString();

        assertThat(actualLabel, Matchers.is("Orginal navn"));
    }

    @Test
    public void testPreferredNameWithNoOriginalName() {
        EnhetsregisterResolver enhetsregisterResolver = new EnhetsregisterResolver();

        Model model = ModelFactory.createDefaultModel();
        Resource publisher = model.createResource("http://publisheruri");

        enhetsregisterResolver.addPreferredOrganisationName(model, publisher, "454", null);

        Statement prefLabelStmt = publisher.getProperty(SKOS.prefLabel);

        assertThat(prefLabelStmt, Matchers.is(Matchers.nullValue()));

    }

}
