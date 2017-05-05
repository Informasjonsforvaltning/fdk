package no.dcat.data.store;

import no.dcat.admin.store.domain.DcatSource;
import no.dcat.admin.store.domain.DcatSource.Harvest;
import org.apache.jena.rdf.model.ResourceFactory;
import org.junit.Test;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class HarvestTest {
	
	@Test
	public void testHarvestComparator() {

		
		Harvest h1 = new DcatSource().new Harvest(ResourceFactory.createResource("http://dcat.difi.no/dcatSource_h1"), "2014-01-01T12:00:00.000+00:00", "h1");
		Harvest h2 = new DcatSource().new Harvest(ResourceFactory.createResource("http://dcat.difi.no/dcatSource_h2"), "2015-01-01T12:00:00.000+00:00", "h2");
		Harvest h3 = new DcatSource().new Harvest(ResourceFactory.createResource("http://dcat.difi.no/dcatSource_h3"), "2016-01-01T12:00:00.000+00:00", "h3");

		DcatSource dcatSource = new DcatSource();
		dcatSource.getHarvested().addAll(Arrays.asList(h1, h3, h2));

		Optional<Harvest> harvest = dcatSource.getLastHarvest();

		assertTrue("Expected harvest to be present", harvest.isPresent());
		assertEquals("Expected \"h3\" to be the latest harvest", h3, harvest.get());
	}
}
