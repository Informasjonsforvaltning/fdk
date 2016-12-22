package no.dcat.portal.webapp.utility;

import no.difi.dcat.datastore.domain.dcat.Publisher;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Utility class for transforming model.
 */
public class TransformModel {

    /**
     * Transforms a flat structure of Publishers into a hierarchical.
     * <p/>
     * A top publisher in a hierarchy is defined by that it has no overorndet Publisher.
     * The return is a list constituted of all the top publisher.
     * All the input Publisher is included in the output but as relations any of the top publisher.
     * Sub and superior Publisher is defined for each Publisher.
     * Sub has both alle the aggregated subPublisher and the subPublisher the level below.
     * <p/>
     *
     * @param publisherFlat A list of flat structured Publisher.
     * @return List of top publisher which has relation to the other Publisher downward the hierarchy.
     */
    public static List<Publisher> organisePublisherHierarcally(List<Publisher> publisherFlat) {

        Map<String, Publisher> publisherMap = new HashMap<>();
        for (Publisher publisher : publisherFlat) {
            publisherMap.put(publisher.getId(), publisher);
        }

        List<Publisher> publisherHier = new ArrayList<>();
        for (Publisher publisher : publisherFlat) {
            if (StringUtils.isNoneEmpty(publisher.getOverordnetEnhet())) {
                Publisher publisherSuperior = publisherMap.get(String.format(Publisher.PUBLISHERID_ENHETSREGISTERET_URI, publisher.getOverordnetEnhet()));
                publisherSuperior.getSubPublisher().add(publisher);
                publisher.setSuperiorPublisher(publisherSuperior);
            } else {
                publisherHier.add(publisher);
            }
        }

        for (Publisher publisher : publisherHier) {
            aggregateSubPublisher(publisher);
        }

        return publisherHier;
    }

    private static List<Publisher> aggregateSubPublisher(Publisher publisher) {
        List<Publisher> aggPublisher = new ArrayList<Publisher>();

        for (Publisher subPublisher : publisher.getSubPublisher()) {
            publisher.getAggrSubPublisher().addAll(aggregateSubPublisher(subPublisher));
        }

        aggPublisher.addAll(publisher.getAggrSubPublisher());
        aggPublisher.add(publisher);

        return aggPublisher;
    }

    /**
     * Transform a hieracical model into a list og top-publisher where all sub-publisher is relted directly to the
     * top-publisher.
     * <p/>
     *
     * @param publishersHier A list of hieracical structured Publisher.
     * @return List of top publisher which has a direct relation to the other Publisher downward the hierarchy.
     */
    public static List<Publisher> groupPublisher(List<Publisher> publishersHier) {
        return publishersHier;
    }

    /**
     * Calculates a topPublishers number of datasets by adding all subPublishers number of dataset.
     * <\P>
     * @param publisherDataSetCount Number of datasets attached to each Publisher. When Publisher is key.
     * @param publisherGrouped A list of top level publisher.
     * @return A list of top level publisher with total number of datasets calculated.
     */
    public static Map<String, String> aggregateDataSetCount(Map<String, String> publisherDataSetCount, List<Publisher>
            publisherGrouped) {
        for (Publisher publisher : publisherGrouped) {
            List<Publisher> subPublishers = publisher.getAggrSubPublisher();
            String nrOfDatasetStr = publisherDataSetCount.get(publisher.getName());

            int nrOfDataset = 0;

            if (nrOfDatasetStr != null ) {
                nrOfDataset = Integer.valueOf(nrOfDatasetStr);
            }

            for(Publisher subPublisher: subPublishers) {
                String nrOfDatasetSubStr = publisherDataSetCount.get(subPublisher.getName());

                if (nrOfDatasetSubStr != null ) {
                    int nrOfDatasetSub = Integer.valueOf(nrOfDatasetSubStr);
                    nrOfDataset += nrOfDatasetSub;
                }
            }
            publisherDataSetCount.put(publisher.getName(), Integer.toString(nrOfDataset));
        }
        return publisherDataSetCount;
    }
}
