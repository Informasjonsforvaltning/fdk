package no.dcat.themes.database;

import no.dcat.shared.Types;
import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.ReadWrite;
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


    static public final String THEMES_GRAPH = "http://data.brreg.no/fdk/themes-graph";

    private final Dataset dataset;

    static private final Logger logger = LoggerFactory.getLogger(TDBService.class);

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


    @CacheEvict(cacheNames = {"codes", "themes"}, allEntries = true)
    public void evictCache() {
        logger.debug("Cache evicted");
    }



}
