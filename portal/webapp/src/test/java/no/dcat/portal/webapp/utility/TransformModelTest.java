package no.dcat.portal.webapp.utility;

import no.dcat.portal.webapp.domain.Publisher;
import org.junit.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;

/**
 * Class for testing TransformModel.
 */
public class TransformModelTest {
    private static final String id_lev1 = "987654321";
    private static final String id_lev2 = "987654322";
    private static final String id_lev3 = "987654323";
    private static final String name_lev1 = "LEVEL1";
    private static final String name_lev2 = "LEVEL2";
    private static final String name_lev3 = "LEVEL3";
    private static final String orgform_orgl = "ORGL";
    private static final String orgform_stat = "STAT";

    @Test
    public void testOrganisePublisherHierarcally() {
        List<Publisher> publishersFlat = new ArrayList<>();
        createPublisherFlat(publishersFlat);

        List<Publisher> publishersHier = TransformModel.organisePublisherHierarcally(publishersFlat);
        assertEquals("One top-level Publisher.", 1, publishersHier.size());
        assertEquals("Name of top-level Publisher.", name_lev1, publishersHier.get(0).getName());
        assertEquals("Id of top-level Publisher.", String.format(Publisher.PUBLISHERID_ENHETSREGISTERET_URI, id_lev1), publishersHier.get(0).getId());
        assertEquals("Number og all Publishers below.", 2, publishersHier.get(0).getAggrSubPublisher().size());

        List<Publisher> subPublisher = publishersHier.get(0).getSubPublisher();
        assertEquals("One second-level Publisher.", 1, subPublisher.size());
        assertEquals("Name of second-level Publisher.", name_lev2, subPublisher.get(0).getName());
        assertEquals("Id of second-level Publisher.", String.format(Publisher.PUBLISHERID_ENHETSREGISTERET_URI, id_lev2), subPublisher.get(0).getId());
        assertEquals("Id of related top-level Publisher.", String.format(Publisher.PUBLISHERID_ENHETSREGISTERET_URI, id_lev1), subPublisher.get(0).getSuperiorPublisher().getId());
        assertEquals("Number og all Publishers below.", 1, subPublisher.get(0).getAggrSubPublisher().size());

        subPublisher = subPublisher.get(0).getSubPublisher();
        assertEquals("One third-level Publisher.", 1, subPublisher.size());
        assertEquals("Name of third-level Publisher.", name_lev3, subPublisher.get(0).getName());
        assertEquals("Id of third-level Publisher.", String.format(Publisher.PUBLISHERID_ENHETSREGISTERET_URI, id_lev3), subPublisher.get(0).getId());
        assertEquals("Id of related second-level Publisher.", String.format(Publisher.PUBLISHERID_ENHETSREGISTERET_URI, id_lev2), subPublisher.get(0).getSuperiorPublisher().getId());
        assertEquals("Number og all Publishers below.", 0, subPublisher.get(0).getAggrSubPublisher().size());
    }

    private void createPublisherFlat(List<Publisher> publishersFlat) {
        publishersFlat.add(createPublisher(id_lev3, name_lev3, orgform_orgl, id_lev2));
        publishersFlat.add(createPublisher(id_lev2, name_lev2, orgform_orgl, id_lev1));
        publishersFlat.add(createPublisher(id_lev1, name_lev1, orgform_stat, null));
    }

    private Publisher createPublisher(String id, String name, String orgForm, String overEnhet) {
        Publisher publisher = new Publisher();
        publisher.setId(String.format(Publisher.PUBLISHERID_ENHETSREGISTERET_URI, id));
        publisher.setName(name);
        publisher.setOrganisasjonsform(orgForm);
        publisher.setOverordnetEnhet(overEnhet);

        return publisher;
    }

    @Test
    public void testAggregateDataSetCount() {
        List<Publisher> publishersFlat = new ArrayList<>();
        createPublisherFlat(publishersFlat);
        List<Publisher> publishersHier = TransformModel.organisePublisherHierarcally(publishersFlat);
        List<Publisher> publishersGroup = TransformModel.groupPublisher(publishersHier);

        Map<String, String> aggDataSetPbu = new HashMap<>();
        aggDataSetPbu.put(name_lev1, "1");
        aggDataSetPbu.put(name_lev2, "1");
        aggDataSetPbu.put(name_lev3, "1");

        aggDataSetPbu = TransformModel.aggregateDataSetCount(aggDataSetPbu, publishersGroup);
        assertEquals("Toplevel publisher shall add subPublishers in the total number of aggregated Dataset.", "3", aggDataSetPbu.get(name_lev1));
        assertEquals("1", "1", aggDataSetPbu.get(name_lev2));
        assertEquals("1", aggDataSetPbu.get(name_lev3));
    }

    @Test
    public void testAggregateDataSetCountOnePublisherHasNoAggregation() {
        List<Publisher> publishersFlat = new ArrayList<>();
        createPublisherFlat(publishersFlat);
        List<Publisher> publishersHier = TransformModel.organisePublisherHierarcally(publishersFlat);
        List<Publisher> publishersGroup = TransformModel.groupPublisher(publishersHier);

        Map<String, String> aggDataSetPbu = new HashMap<>();
        aggDataSetPbu.put(name_lev1, "1");
        aggDataSetPbu.put(name_lev2, "1");

        aggDataSetPbu = TransformModel.aggregateDataSetCount(aggDataSetPbu, publishersGroup);
        assertEquals("Toplevel publisher shall add subPublishers in the total number of aggregated Dataset.", "2", aggDataSetPbu.get(name_lev1));
        assertEquals("1", "1", aggDataSetPbu.get(name_lev2));
    }

    @Test
    public void testAggregateDataSetCountTopPublisherHasNoAggregation() {
        List<Publisher> publishersFlat = new ArrayList<>();
        createPublisherFlat(publishersFlat);
        List<Publisher> publishersHier = TransformModel.organisePublisherHierarcally(publishersFlat);
        List<Publisher> publishersGroup = TransformModel.groupPublisher(publishersHier);

        Map<String, String> aggDataSetPbu = new HashMap<>();
        aggDataSetPbu.put(name_lev2, "1");
        aggDataSetPbu.put(name_lev3, "1");

        aggDataSetPbu = TransformModel.aggregateDataSetCount(aggDataSetPbu, publishersGroup);
        assertEquals("Toplevel publisher shall add subPublishers in the total number of aggregated Dataset.", "2", aggDataSetPbu.get(name_lev1));
        assertEquals("1", "1", aggDataSetPbu.get(name_lev2));
        assertEquals("1", aggDataSetPbu.get(name_lev3));
    }
}