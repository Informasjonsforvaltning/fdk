package no.difi.dcat.datastore.domain.dcat.builders;

import no.difi.dcat.datastore.domain.dcat.Publisher;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.rdf.model.*;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;

import java.util.ArrayList;
import java.util.List;

/**
 * Class for building Publishers to be loaded into elasticsearch.
 */
public class PublisherBuilder extends AbstractBuilder {

    protected final Model model;

    public PublisherBuilder(Model model) {
        this.model = model;
    }

    public List<Publisher> build() {
        List<Publisher> publishers = new ArrayList<>();

        ResIterator agentIterator = model.listResourcesWithProperty(RDF.type, FOAF.Agent);
        while (agentIterator.hasNext()){
            Resource agent = agentIterator.next();
            addPublisherFromStmt(publishers, agent, model);
        }

        return publishers;
    }

    private void addPublisherFromStmt(List<Publisher> publishers, Resource resource, Model model) {
        Publisher publisherObj = new Publisher();
        extractPublisherFromStmt(publisherObj, resource);

        if (publisherObj == null) {
            return;
        }
        publishers.add(publisherObj);
    }
}
