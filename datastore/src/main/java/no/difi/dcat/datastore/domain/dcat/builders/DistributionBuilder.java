package no.difi.dcat.datastore.domain.dcat.builders;

import no.difi.dcat.datastore.domain.dcat.DataTheme;
import no.difi.dcat.datastore.domain.dcat.Distribution;
import no.difi.dcat.datastore.domain.dcat.SkosCode;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DistributionBuilder extends AbstractBuilder {

    protected final Model model;
    protected final Map<String, SkosCode> locations;
    protected final Map<String, Map<String, SkosCode>> codes;
    protected final Map<String, DataTheme> dataThemes;

    public DistributionBuilder(Model model, Map<String, SkosCode> locations, Map<String, Map<String, SkosCode>> codes,
                               Map<String, DataTheme> dataThemes) {
        this.model = model;
        this.locations = locations;
        this.codes = codes;
        this.dataThemes = dataThemes;
    }

    public List<Distribution> build() {
        List<Distribution> distributions = new ArrayList<>();

        ResIterator catalogIterator = model.listResourcesWithProperty(RDF.type, DCAT.Catalog);
        while (catalogIterator.hasNext()) {
            Resource catalog = catalogIterator.next();

            //ResIterator datasetIterator = catalog.getModel().listResourcesWithProperty(RDF.type, DCAT.Dataset);
            StmtIterator datasetIterator = catalog.listProperties(DCAT.dataset);


            while (datasetIterator.hasNext()) {
                Resource dataset = datasetIterator.next().getResource();
                StmtIterator distributionIterator = dataset.listProperties(DCAT.distribution);

                while (distributionIterator.hasNext()) {
                    Statement next = distributionIterator.nextStatement();

                    if (next.getObject().isResource()) {
                        Resource distribution = next.getResource();
                        distributions.add(create(distribution, dataset, catalog, locations, codes, dataThemes));
                    }
                }
            }
        }

        return distributions;

    }

    public static Distribution create(Resource distribution, Resource dataset, Resource catalog, Map<String, SkosCode> locations,
                                      Map<String, Map<String, SkosCode>> codes, Map<String, DataTheme> dataThemes) {
        Distribution created = new Distribution();

        if (distribution != null) {
            created.setId(distribution.getURI());
            created.setTitle(extractLanguageLiteral(distribution, DCTerms.title));
            created.setDescription(extractLanguageLiteral(distribution, DCTerms.description));
            created.setAccessURL(extractAsString(distribution, DCAT.accessUrl));
            created.setLicense(extractAsString(distribution, DCTerms.license));
            created.setFormat(extractAsString(distribution, DCTerms.format));
        }
        if (dataset != null && dataset != null) {
            created.setDataset(DatasetBuilder.create(dataset, catalog, locations, codes, dataThemes));
        }

        return created;
    }

}
