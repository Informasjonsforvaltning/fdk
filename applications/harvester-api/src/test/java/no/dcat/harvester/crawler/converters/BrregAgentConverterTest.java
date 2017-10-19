package no.dcat.harvester.crawler.converters;

import no.dcat.harvester.HarvesterApplication;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.NodeIterator;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.RDF;
import org.junit.Test;

import java.io.File;
import java.net.URL;
import java.nio.file.Paths;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class BrregAgentConverterTest {
	
	@Test
	public void testConvertBrregFile() throws Exception {
		BrregAgentConverter converter = new BrregAgentConverter(HarvesterApplication.getBrregCache());
		
		Model model = ModelFactory.createDefaultModel();
		
		URL uri = Paths.get("src/test/resources/brreg/814716902.xml").toUri().toURL();

		String currentPath = new File(new File(".").getAbsolutePath()).toString().replace(".","");

		converter.setPublisherIdURI("file:////"+ currentPath + "/src/test/resources/brreg/%s");
		converter.collectFromUri(uri.toString(), model, model.createResource("http://data.brreg.no/enhetsregisteret/underenhet/814716902"));


		ResIterator iterator = model.listResourcesWithProperty(RDF.type);

		assertEquals("Expected model to contain one resource.", "http://data.brreg.no/enhetsregisteret/underenhet/814716902", iterator.nextResource().getURI());
		assertEquals("Expected model to contain one resource.", "http://data.brreg.no/enhetsregisteret/enhet/814716872", iterator.nextResource().getURI());
	}

	@Test
	public void testConvertBrregFileBlankNode() throws Exception {
		BrregAgentConverter converter = new BrregAgentConverter(HarvesterApplication.getBrregCache());

		Model model = FileManager.get().loadModel(BrregAgentConverterTest.class.getClassLoader().getResource("brreg/blankNodeTest.xml").getFile());

		converter.collectFromModel(model);

		// this just tests that we can handle blank nodes
		// no assertion is made, just tests that there is no null pointer exception
	}
	
	@Test
	public void testMissingBrregFile() throws Exception {
		BrregAgentConverter converter = new BrregAgentConverter(HarvesterApplication.getBrregCache());
		
		Model model = ModelFactory.createDefaultModel();
		
		converter.collectFromUri("http://test", model, model.createResource("http://test"));
		
		NodeIterator listObjectsOfProperty = model.listObjectsOfProperty(RDF.type);
		
		assertTrue("Expected empty model", listObjectsOfProperty.toList().isEmpty());
	}

	@Test
	public void testConvertOnRDFWithIdentifier() throws Exception {
		BrregAgentConverter converter = new BrregAgentConverter(HarvesterApplication.getBrregCache());
		Model model = FileManager.get().loadModel("rdf/virksomheter.ttl");
		converter.collectFromModel(model);
		NodeIterator countryiter = model.listObjectsOfProperty(
				model.createResource("http://data.brreg.no/enhetsregisteret/enhet/991825827/forretningsadresse"),
				model.createProperty("http://data.brreg.no/meta/land"));
		assertEquals("Norge" , countryiter.next().asLiteral().getValue().toString());
	}

    @Test
    public void testConvertOnRDFReplaceCanonicalName() throws Exception {
        BrregAgentConverter converter = new BrregAgentConverter(HarvesterApplication.getBrregCache());
        Model model = FileManager.get().loadModel("rdf/virksomheter.ttl");
        converter.collectFromModel(model);
        NodeIterator nameiter = model.listObjectsOfProperty(
                model.createResource("http://data.brreg.no/enhetsregisteret/enhet/971040238"),
                FOAF.name);
        assertEquals("Kartverket" , nameiter.next().asLiteral().getValue().toString());
    }


}
