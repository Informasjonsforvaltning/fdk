package no.dcat.datastore;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.Arrays;
import java.util.Optional;

import no.dcat.datastore.domain.DcatSource;
import no.fdk.test.testcategories.LoadTest;
import org.apache.jena.rdf.model.ResourceFactory;
import org.junit.Test;
import org.junit.experimental.categories.Category;

@Category(LoadTest.class)
public class HarvestTest {
	
	@Test
	public void testHarvestComparator() {
		
		DcatSource.Harvest h1 = new DcatSource().new Harvest(ResourceFactory.createResource("http://dcat.difi.no/dcatSource_h1"), "2014-01-01T12:00:00.000+00:00", "h1");
		DcatSource.Harvest h2 = new DcatSource().new Harvest(ResourceFactory.createResource("http://dcat.difi.no/dcatSource_h2"), "2015-01-01T12:00:00.000+00:00", "h2");
		DcatSource.Harvest h3 = new DcatSource().new Harvest(ResourceFactory.createResource("http://dcat.difi.no/dcatSource_h3"), "2016-01-01T12:00:00.000+00:00", "h3");

		DcatSource dcatSource = new DcatSource();
		dcatSource.getHarvested().addAll(Arrays.asList(h1, h3, h2));

		Optional<DcatSource.Harvest> harvest = dcatSource.getLastHarvest();

		assertTrue("Expected harvest to be present", harvest.isPresent());
		assertEquals("Expected \"h3\" to be the latest harvest", h3, harvest.get());
	}
}
