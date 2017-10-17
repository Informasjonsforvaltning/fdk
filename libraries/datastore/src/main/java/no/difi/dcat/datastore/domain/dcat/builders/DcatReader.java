package no.difi.dcat.datastore.domain.dcat.builders;

import no.difi.dcat.datastore.domain.dcat.client.LoadLocations;
import no.difi.dcat.datastore.domain.dcat.client.RetrieveCodes;
import no.difi.dcat.datastore.domain.dcat.client.RetrieveDataThemes;
import no.dcat.shared.DataTheme;
import no.dcat.shared.Dataset;
import no.dcat.shared.SkosCode;
import org.apache.jena.rdf.model.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

public class DcatReader {
    private static Logger logger = LoggerFactory.getLogger(DcatReader.class);

    Map<String, DataTheme> dataThemes;
    LoadLocations loadLocations;
    Map<String, Map<String, SkosCode>> codes;
    Model model;

    public DcatReader(Model model, String codeServiceHost, String httpUsername, String httpPassword) {
        this.model = model;
        // Retrieve all codes from elasticsearch.
        logger.debug("reading themes from: {}",codeServiceHost);
        dataThemes = RetrieveDataThemes.getAllDataThemes(codeServiceHost);

        loadLocations = new LoadLocations(codeServiceHost, httpUsername, httpPassword);
        loadLocations.addLocationsToThemes(model);

        codes = RetrieveCodes.getAllCodes(codeServiceHost);
    }

    public List<no.difi.dcat.datastore.domain.dcat.Distribution> getDistributions() {
        return new DistributionBuilder(model, loadLocations.getLocations(), codes, dataThemes).build();
    }

    public List<Dataset> getDatasets() {
        return new DatasetBuilder(model, loadLocations.getLocations(), codes, dataThemes).build();
    }

}
