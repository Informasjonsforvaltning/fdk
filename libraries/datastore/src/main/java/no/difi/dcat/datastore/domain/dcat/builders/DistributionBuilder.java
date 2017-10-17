package no.difi.dcat.datastore.domain.dcat.builders;

import no.dcat.shared.DataTheme;
import no.dcat.shared.SkosCode;
import no.dcat.shared.SkosConcept;
import no.difi.dcat.datastore.domain.dcat.Distribution;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;

import java.util.ArrayList;
import java.util.Arrays;
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

            //ResIterator datasetIterator = catalogId.getModel().listResourcesWithProperty(RDF.type, DCAT.Dataset);
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

    public static no.difi.dcat.datastore.domain.dcat.Distribution create(Resource distResource, Resource dataset, Resource catalog, Map<String, SkosCode> locations,
                                                                         Map<String, Map<String, SkosCode>> codes, Map<String, DataTheme> dataThemes) {
        Distribution dist = new Distribution();

        if (distResource != null) {
            dist.setId(distResource.getURI());
            dist.setUri(distResource.getURI());

            dist.setTitle(extractLanguageLiteral(distResource, DCTerms.title));
            dist.setDescription(extractLanguageLiteral(distResource, DCTerms.description));
            dist.setAccessURL(asList(extractAsString(distResource, DCAT.accessUrl)));
            dist.setLicense(SkosConcept.getInstance(extractAsString(distResource, DCTerms.license),""));

            dist.setConformsTo(extractSkosConcept(distResource, DCTerms.conformsTo));
            dist.setPage(extractSkosConcept(distResource, FOAF.page));
            dist.setFormat(asList(extractAsString(distResource, DCTerms.format)));

            dist.setType(extractAsString(distResource, DCTerms.type));

        }
        if (dataset != null && dataset != null) {
            dist.setDataset(DatasetBuilder.create(dataset, catalog, locations, codes, dataThemes));
        }

        return dist;
    }

}
