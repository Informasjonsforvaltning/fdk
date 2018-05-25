package no.dcat.harvester.crawler.converters;

import no.dcat.harvester.HarvesterApplication;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.NodeIterator;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.RDF;
import org.junit.Test;

import static org.junit.Assert.assertTrue;


public class BrregAgentConverterTest {

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


}
