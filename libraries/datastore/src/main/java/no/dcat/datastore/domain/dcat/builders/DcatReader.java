package no.dcat.datastore.domain.dcat.builders;

import no.dcat.datastore.domain.dcat.Distribution;
import no.dcat.datastore.domain.dcat.client.LoadLocations;
import no.dcat.shared.Catalog;
import no.dcat.shared.Subject;
import no.dcat.datastore.domain.dcat.client.RetrieveCodes;
import no.dcat.datastore.domain.dcat.client.RetrieveDataThemes;
import no.dcat.shared.DataTheme;
import no.dcat.shared.Dataset;
import no.dcat.shared.SkosCode;
import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.RDF;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DcatReader {
    private static Logger logger = LoggerFactory.getLogger(DcatReader.class);

    Map<String, DataTheme> dataThemes;
    Map<String, SkosCode> locations;
    Map<String, Map<String, SkosCode>> codes;
    Model model;
    DatasetBuilder builder;

    public DcatReader(Model model, String codeServiceHost, String httpUsername, String httpPassword) {
        this.model = model;

        // Retrieve all codes from reference-data.
        logger.debug("reading codes from: {}", codeServiceHost);
        dataThemes = RetrieveDataThemes.getAllDataThemes(codeServiceHost);
        codes = RetrieveCodes.getAllCodes(codeServiceHost);

        if (codes.get("location") != null) {
            locations = codes.get("location");
        } else {
            locations = new HashMap<>();
        }

        LoadLocations loadLocations = new LoadLocations(codeServiceHost, httpUsername, httpPassword);
        loadLocations.addLocationsToThemes(model, codes.get("location"));

        locations.putAll(loadLocations.getLocations());

        builder = new DatasetBuilder(model, locations, codes, dataThemes);
    }

    public DcatReader(Model model) {
        this.model = model;
        dataThemes = new HashMap<>();
        codes = new HashMap<>();
        locations = new HashMap<>();

        builder = new DatasetBuilder(model, locations, codes, dataThemes);
    }

    public List<Distribution> getDistributions() {
        return new DistributionBuilder(model, codes).build();
    }

    public List<Dataset> getDatasets() {
        return builder.build().getDataset();
    }

    public List<Catalog> getCatalogs() {
        List<Catalog> result = new ArrayList<>();

        ResIterator catalogIterator = model.listResourcesWithProperty(RDF.type, DCAT.Catalog);
        while (catalogIterator.hasNext()) {
            Resource catalogResource = catalogIterator.next();

            Catalog catalog = CatalogBuilder.create(catalogResource);
            result.add(catalog);
        }

        return result;
    }

    public List<Subject> getSubjects() {
        return builder.build().getSubjects();
    }



}
