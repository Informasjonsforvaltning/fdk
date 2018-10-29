package no.ccat.database;

import org.apache.jena.query.Dataset;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.reasoner.ReasonerRegistry;
import org.apache.jena.util.FileManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;


/**
 * Created by extkkj on 27.09.2017.
 */

@Service
@Scope("thread")
public class TDBInferenceService {
    private final TDBService tdbService;
    private Model schema  = FileManager.get().loadModel("ontology.ttl");

    static private final Logger logger = LoggerFactory.getLogger(TDBInferenceService.class);

    @Autowired
    public TDBInferenceService(TDBService tdbService) {
        this.tdbService = tdbService;
    }

    public Model getModelWithInference(String name) {

        logger.info("Model for name not cached: {}", name);
        return ModelFactory.createInfModel(ReasonerRegistry.getRDFSReasoner(), schema, tdbService.getDataset().getNamedModel(name));

    }

    public Model describeWithInference(String uri) {
        Query query = QueryFactory.create("describe <" + uri + ">");
        Model model = QueryExecutionFactory.create(query, tdbService.getDataset()).execDescribe();
        return ModelFactory.createInfModel(ReasonerRegistry.getRDFSReasoner(), schema, model);

    }

    public Dataset getDataset() {
        return tdbService.getDataset();
    }



    public Model getModel(String name) {

        logger.info("Model for name not cached: {}", name);
        return getDataset().getNamedModel(name);

    }




    public void addModelToGraph(Model model, String location) {
        getDataset().getNamedModel(location).add(model);
        tdbService.evictCache();
    }

    public void evictCache() {
        tdbService.evictCache();
    }
}
