package no.dcat.api.synd;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;
import java.util.List;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.util.FileManager;
import org.junit.Test;

/**
 * Created by havardottestad on 13/01/16.
 */
public class DcatFeedTest {

	@Test
	public void testGetInstance() throws Exception {

		String file = this.getClass().getClassLoader().getResource("test-perfect.rdf").getFile();

		Model m = FileManager.get().loadModel(file);
		m.write(System.out, "TTL");
		DcatFeed instance = DcatFeed.getInstance(m.getResource("http://nobelprize.org/datasets/dcat#ds1"));

		String expectedSubject = "http://eurovoc.europa.eu/100142";
		assertTrue("Subject should be 'http://eurovoc.europa.eu/100142'",instance.getDcatModule().getSubjects().contains(expectedSubject));
		assertEquals("Publuisher should be 'Nobel Media AB'", "Nobel Media AB", instance.getDcatModule().getPublisher());

		List<String> expectedKeywords = Arrays.asList("prize", "science", "Nobel prize");
		assertTrue("Keyword list should be \"prize\", \"science\", \"Nobel prize\"", expectedKeywords.containsAll(instance.getDcatModule().getKeywords()) && instance.getDcatModule().getKeywords().containsAll(expectedKeywords));
		
		String expectedAccessURL = "http://data.nobelprize.org/";
		assertTrue("Link should be \"http://data.nobelprize.org/\"", instance.getLink().contains(expectedAccessURL));
		
		String expectedFormat = "http://nobelprize.org/format/rdf+xml";
		assertTrue("Format should be \"http://nobelprize.org/format/rdf+xml\"", instance.getDcatModule().getFormats().contains(expectedFormat));
	}
}