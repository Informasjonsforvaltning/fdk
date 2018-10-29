package no.ccat.database;

import no.dcat.shared.Types;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.reasoner.ReasonerRegistry;
import org.apache.jena.tdb.TDB;
import org.apache.jena.tdb.TDBFactory;
import org.apache.jena.tdb.base.file.Location;
import org.apache.jena.update.UpdateAction;
import org.apache.jena.update.UpdateFactory;
import org.apache.jena.update.UpdateRequest;
import org.apache.jena.util.FileManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class TDBService {

    static private final Logger logger = LoggerFactory.getLogger(TDBService.class);

    static public final String THEMES_GRAPH = "http://data.brreg.no/fdk/themes-graph";
    static public final String HELPTEXTS_GRAPH = "http://data.brreg.no/fdk/helptexts-graph";

    private final Dataset dataset;


    private Model schema = FileManager.get().loadModel("ontology.ttl");

    public TDBService() {
        this("./tdb");
    }

    public TDBService(String location) {
        dataset = TDBFactory.createDataset(Location.create(location));
        TDB.getContext().set(TDB.symUnionDefaultGraph, true);
    }





    Dataset getDataset() {
        return dataset;
    }

    @PostConstruct
    public void postConstruct() {

        for (Types type : Types.values()) {
            String sourceUrl = type.getSourceUrl();
            String s = type.toString();

            if (sourceUrl != null) {
                overwrite(s, FileManager.get().loadModel(sourceUrl));
            }

        }

        Model m = FileManager.get().loadModel("rdf/data-theme-skos.rdf");
        changeLanguageNoToNb(DatasetFactory.create(m));
        overwrite(THEMES_GRAPH, m);
        Model hm = FileManager.get().loadModel("rdf/hjelpetekster.ttl");
        changeLanguageNoToNb(DatasetFactory.create(hm));
        overwrite(HELPTEXTS_GRAPH, hm);

    }

    private void changeLanguageNoToNb(Dataset dataset) {
        transform(dataset,
                String.join("\n", "",
                        "delete {?a ?b ?c}",
                        "insert {?a ?b ?newC}",
                        "where {?a ?b ?c",
                        "   FILTER (lang(?c) = \"no\")",
                        "    BIND(STRLANG(STR(?c), \"nb\") as ?newC)",
                        "}"
                )
        );
    }

    private void transform(Dataset dataset, String query) {
        UpdateRequest request = UpdateFactory.create("" + query);
        UpdateAction.execute(request, dataset);
    }

    private void overwrite(String graphName, Model m) {

        dataset.begin(ReadWrite.WRITE);
        try {

            dataset.removeNamedModel(graphName);
            dataset.addNamedModel(graphName, m);

        } finally {
            dataset.commit();
        }

        evictCache();

    }


    @CacheEvict(cacheNames = {"codes", "themes", "helptexts"}, allEntries = true)
    public void evictCache() {
        logger.debug("Cache evicted");
    }


    public Model getModel(String name) {

        logger.info("Model for name not cached: {}", name);
        return dataset.getNamedModel(name);

    }

    public Model getModelWithInference(String name) {

        logger.info("Model for name not cached: {}", name);
        return ModelFactory.createInfModel(ReasonerRegistry.getRDFSReasoner(), schema, dataset.getNamedModel(name));

    }


    public void addModelToGraph(Model model, String location) {
        dataset.getNamedModel(location).add(model);
        evictCache();
    }

    public Model describeWithInference(String uri) {
        Query query = QueryFactory.create("describe <" + uri + ">");
        Model model = QueryExecutionFactory.create(query, dataset).execDescribe();
        return ModelFactory.createInfModel(ReasonerRegistry.getRDFSReasoner(), schema, model);

    }
}
