package no.dcat.datastore.domain;

import no.fdk.test.testcategories.UnitTest;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import static org.junit.Assert.assertEquals;

/**
 * Created by havardottestad on 18/01/16.
 */
@Category(UnitTest.class)
public class HarvestTest {

    @Test
    public void testGetCreatedDateFormatted() throws Exception {

        DcatSource.Harvest harvest = new DcatSource().new Harvest(null, "2016-01-12T10:00:00.00+00:00", null);
        String createdDateFormatted = harvest.getCreatedDateFormatted();

        assertEquals("Should give out datetime in oslo timezone without the timezone ending", "12.01.16 11:00", createdDateFormatted);

    }
}
