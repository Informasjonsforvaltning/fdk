package no.dcat.themes.database;

import org.apache.jena.query.*;
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
        QueryExecution queryExection = null;
        try {
            Query query = QueryFactory.create("describe <" + uri + ">");
            queryExection = QueryExecutionFactory.create(query, tdbService.getDataset());
            Model model = queryExection.execDescribe();
            return ModelFactory.createInfModel(ReasonerRegistry.getRDFSReasoner(), schema, model);
        } catch (Throwable t) {
            logger.error("Thrown error in describeWithInterface, for URI: {} ", uri);
        } finally {
            if (queryExection!=null) {
                try {
                    queryExection.close();
                } catch (Throwable t) {
                    //We silently swallow any errors on closing, any serious errors should have been caught and logged in the exception clause above
                }
            }
        }
        return null;
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
