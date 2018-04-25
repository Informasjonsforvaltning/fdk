package no.dcat.datastore.domain.dcat.builders;

import no.dcat.datastore.domain.dcat.Distribution;
import no.dcat.shared.DataTheme;
import no.dcat.shared.SkosCode;
import no.dcat.shared.SkosConcept;
import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.dcat.shared.Types;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DistributionBuilder extends AbstractBuilder {
    private static Logger logger = LoggerFactory.getLogger(DistributionBuilder.class);

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

    public static Distribution create(Resource distResource, Resource dataset, Resource catalog, Map<String, SkosCode> locations,
                                      Map<String, Map<String, SkosCode>> codes, Map<String, DataTheme> dataThemes) {
        Distribution dist = new Distribution();

        if (distResource != null) {
            dist.setId(null);
            dist.setUri(distResource.getURI());

            dist.setTitle(extractLanguageLiteral(distResource, DCTerms.title));
            dist.setDescription(extractLanguageLiteral(distResource, DCTerms.description));
            dist.setAccessURL(extractUriList(distResource, DCAT.accessUrl));
            dist.setDownloadURL(extractUriList(distResource, DCAT.downloadUrl));

            List<SkosConcept> licenses = extractSkosConcept(distResource, DCTerms.license);
            if (licenses != null && licenses.size()>0) {
                SkosConcept firstLicense = licenses.get(0);

                // can we add a prefLabel on a uri with an open license
                if (codes != null && firstLicense.getPrefLabel() == null) {
                    Map<String, SkosCode> licenseCodeMap = codes.get(Types.openlicenses.getType());
                    if (licenseCodeMap != null) {
                        licenseCodeMap.forEach((key, code) -> {
                            if (firstLicense.getUri().startsWith(code.getUri())) {
                                firstLicense.setPrefLabel(code.getPrefLabel());
                                logger.info("PREFLABEL: {} - {}", firstLicense.getUri(), firstLicense.getPrefLabel().get("no"));
                            }
                        });
                    }
                }
                dist.setLicense(firstLicense);

                if (licenses.size() > 1) {

                    logger.warn("There are more than one recommended licence in inputdata. They will be ignored");
                }
            }

            dist.setConformsTo(extractSkosConcept(distResource, DCTerms.conformsTo));
            dist.setPage(extractSkosConcept(distResource, FOAF.page));
            dist.setFormat(extractMultipleStringsExcludeBaseUri(distResource, DCTerms.format));

            dist.setType(extractAsString(distResource, DCTerms.type));

        }
        if (dataset != null) {
            dist.setDataset(DatasetBuilder.create(dataset, catalog, locations, codes, dataThemes));
        }

        return dist;
    }

}
