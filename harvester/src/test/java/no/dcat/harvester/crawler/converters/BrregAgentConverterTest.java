package no.dcat.harvester.crawler.converters;

import no.dcat.harvester.Application;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.NodeIterator;
import org.apache.jena.rdf.model.ResIterator;
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
		BrregAgentConverter converter = new BrregAgentConverter(Application.getBrregCache());
		
		Model model = ModelFactory.createDefaultModel();
		
		URL uri = Paths.get("src/test/resources/brreg/814716902.xml").toUri().toURL();

		String currentPath = new File(new File(".").getAbsolutePath()).toString().replace(".","");

		converter.setPublisherIdURI("file:////"+ currentPath + "/src/test/resources/brreg/%s");
		converter.collectFromUri(uri.toString(), model);

		model.write(System.out, "TTL");
		
		ResIterator iterator = model.listResourcesWithProperty(RDF.type);

		assertEquals("Expected model to contain one resource.", "http://data.brreg.no/enhetsregisteret/underenhet/814716902", iterator.nextResource().getURI());
		assertEquals("Expected model to contain one resource.", "http://data.brreg.no/enhetsregisteret/enhet/814716872", iterator.nextResource().getURI());
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
