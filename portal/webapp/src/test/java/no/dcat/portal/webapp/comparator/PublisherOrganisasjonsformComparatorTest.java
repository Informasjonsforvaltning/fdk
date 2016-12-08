package no.dcat.portal.webapp.comparator;

import no.difi.dcat.datastore.domain.dcat.Publisher;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Class for testing  PublisherOrganisasjonsformComparator
 */
public class PublisherOrganisasjonsformComparatorTest {

    @Test
    public void testBothNull() {
        Publisher p1 = new Publisher();
        Publisher p2 = new Publisher();

        PublisherOrganisasjonsformComparator p = new PublisherOrganisasjonsformComparator();
        assertEquals(0, p.compare(p1, p2));
    }

    @Test
    public void testFirstNull() {
        Publisher p1 = new Publisher();
        Publisher p2 = new Publisher();
        p2.setOrganisasjonsform("ORGL");

        PublisherOrganisasjonsformComparator p = new PublisherOrganisasjonsformComparator();
        assertEquals(1, p.compare(p1, p2));
    }

    @Test
    public void testSecondNull() {
        Publisher p1 = new Publisher();
        Publisher p2 = new Publisher();
        p1.setOrganisasjonsform("ORGL");

        PublisherOrganisasjonsformComparator p = new PublisherOrganisasjonsformComparator();
        assertEquals(-1, p.compare(p1, p2));
    }

    @Test
    public void testKommVsStat() {
        Publisher p1 = new Publisher();
        Publisher p2 = new Publisher();
        p1.setOrganisasjonsform("STAT");
        p2.setOrganisasjonsform("KOMM");

        PublisherOrganisasjonsformComparator p = new PublisherOrganisasjonsformComparator();
        assertEquals(-1, p.compare(p1, p2));
    }

    @Test
    public void testKommVsOrgl() {
        Publisher p1 = new Publisher();
        Publisher p2 = new Publisher();
        p1.setOrganisasjonsform("ORGL");
        p2.setOrganisasjonsform("KOMM");

        PublisherOrganisasjonsformComparator p = new PublisherOrganisasjonsformComparator();
        assertEquals(1, p.compare(p1, p2));
    }

    @Test
    public void testKommVsKomm() {
        Publisher p1 = new Publisher();
        Publisher p2 = new Publisher();
        p1.setOrganisasjonsform("KOMM");
        p2.setOrganisasjonsform("KOMM");

        PublisherOrganisasjonsformComparator p = new PublisherOrganisasjonsformComparator();
        assertEquals(0, p.compare(p1, p2));
    }
}
