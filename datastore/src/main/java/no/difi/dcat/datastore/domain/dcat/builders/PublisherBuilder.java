package no.difi.dcat.datastore.domain.dcat.builders;

import no.difi.dcat.datastore.domain.dcat.Publisher;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.RDF;

import java.util.ArrayList;
import java.util.List;

/**
 * Class for buildeing Publishers to be loaded into elasticsearch.
 */
public class PublisherBuilder extends DatasetBuilder {

    public PublisherBuilder(Model model) {
        super(model);
    }

    public List<Publisher> build() {
        List<Publisher> publishers = new ArrayList<>();

        ResIterator catalogIterator = model.listResourcesWithProperty(RDF.type, DCAT.Catalog);
        while (catalogIterator.hasNext()) {
            Resource catalog = catalogIterator.next();
            StmtIterator datasetIterator = catalog.listProperties(DCAT.dataset);

            while (datasetIterator.hasNext()) {
                addPublisher(publishers, datasetIterator.next().getResource(), model);
            }
        }
        return publishers;
    }

    private void addPublisher(List<Publisher> publishers, Resource dataset, Model model) {
        Publisher publisherObj = extractPublisher(dataset);

        if (publisherObj == null) {
            return;
        }
        publishers.add(publisherObj);

        if(StringUtils.isNotEmpty(publisherObj.getOverordnetEnhet())) {
            String id = String.format(Publisher.PUBLISHERID_ENHETSREGISTERET_URI,publisherObj.getOverordnetEnhet());
            Resource resource = model.getResource(id);
            addPublisherFromStmt(publishers, resource, model);
        }
    }

    private void addPublisherFromStmt(List<Publisher> publishers, Resource resource, Model model) {
        Publisher publisherObj = new Publisher();
        extractPublisherFromStmt(publisherObj, resource);

        if (publisherObj == null) {
            return;
        }
        publishers.add(publisherObj);

        if(StringUtils.isNotEmpty(publisherObj.getOverordnetEnhet())) {
            String id = String.format(Publisher.PUBLISHERID_ENHETSREGISTERET_URI,publisherObj.getOverordnetEnhet());
            Resource resourceOver = model.getResource(id);
            addPublisherFromStmt(publishers, resourceOver, model);
        }
    }
}
