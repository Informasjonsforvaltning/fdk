package no.difi.dcat.harvester.crawler.converters;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.net.URL;
import java.nio.file.Paths;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.NodeIterator;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.RDF;
import org.junit.Test;

import no.difi.dcat.harvester.Application;

public class BrregConverterTest {
	
	@Test
	public void testConvertBrregFile() throws Exception {
		BrregAgentConverter converter = new BrregAgentConverter(Application.getBrregCache());
		
		Model model = ModelFactory.createDefaultModel();
		
		URL uri = Paths.get("src/test/resources/brreg/814716902.xml").toUri().toURL();
		
		converter.collectFromUri(uri.toString(), model);
		
		NodeIterator iterator = model.listObjectsOfProperty(RDF.type);
		
		assertEquals("Expected model to contain one resource of type foaf:Agent", "http://xmlns.com/foaf/0.1/Agent", iterator.next().asResource().getURI());
	}

	@Test
	public void testConvertBrregFileBlankNode() throws Exception {
		BrregAgentConverter converter = new BrregAgentConverter(Application.getBrregCache());

		Model model = FileManager.get().loadModel("src/test/resources/brreg/blankNodeTest.xml");

		converter.collectFromModel(model);

		// this just tests that we can handle blank nodes
		// no assertion is made, just tests that there is no null pointer exception
	}
	
	@Test
	public void testMissingBrregFile() throws Exception {
		BrregAgentConverter converter = new BrregAgentConverter(Application.getBrregCache());
		
		Model model = ModelFactory.createDefaultModel();
		
		converter.collectFromUri("http://test", model);
		
		NodeIterator listObjectsOfProperty = model.listObjectsOfProperty(RDF.type);
		
		assertTrue("Expected empty model", listObjectsOfProperty.toList().isEmpty());
	}

}
