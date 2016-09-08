package no.difi.dcat.datastore.domain;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

/**
 * Created by havardottestad on 18/01/16.
 */
public class HarvestTest {

	@Test
	public void testGetCreatedDateFormatted() throws Exception {

		DcatSource.Harvest harvest = new DcatSource().new Harvest(null, "2016-01-12T10:00:00.00+00:00", null);
		String createdDateFormatted = harvest.getCreatedDateFormatted();

		assertEquals("Should give out datetime in oslo timezone without the timezone ending", "12.01.16 11:00", createdDateFormatted);

	}
}