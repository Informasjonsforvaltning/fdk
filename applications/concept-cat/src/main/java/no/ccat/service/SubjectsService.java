package no.ccat.service;

import no.dcat.shared.Subject;
import no.dcat.shared.Types;
import no.ccat.database.TDBConnection;
import no.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import org.apache.jena.atlas.web.HttpException;
import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.query.ReadWrite;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.net.MalformedURLException;
import java.net.URL;

@Service
public class SubjectsService extends BaseServiceWithFraming {

    static private final Logger logger = LoggerFactory.getLogger(SubjectsService.class);

    @Autowired
    public SubjectsService(TDBConnection tdbConnection) {
        super(tdbConnection);
    }


    @Cacheable("subjects")
    public Subject addSubject(String uri) throws MalformedURLException, HttpException {
        try {
            return getSubject(uri);
        } catch (Throwable e) {
            Model model = getRemoteModel(new URL(uri));

            tdbConnection.inTransaction(ReadWrite.WRITE, connection -> {
                connection.addModelToGraph(model, Types.subject.toString());
                return null;
            });

            return getSubject(uri);
        }

    }

    public Subject getSubject(String uri) {
        return tdbConnection.inTransaction(ReadWrite.READ, connection -> {
            Dataset dataset = DatasetFactory.create(connection.describeWithInference(uri));

            ResIterator resIterator = dataset.getDefaultModel().listResourcesWithProperty(RDF.type, SKOS.Concept);

            Resource resource = resIterator.nextResource();
            if (resource.getURI().equals(uri)) {

                Subject result = DatasetBuilder.extractSubject(resource);

                dataset.close();
                return result;
            }

            dataset.close();
            return null;
        });
    }
}
