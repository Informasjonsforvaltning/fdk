package no.dcat.datastore.domain.dcat.builders;

import no.dcat.datastore.domain.dcat.Distribution;
import no.dcat.shared.SkosCode;
import no.dcat.shared.SkosConcept;
import no.dcat.shared.DataDistributionService;
import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.dcat.datastore.domain.dcat.vocabulary.DCATapi;
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
import java.util.List;
import java.util.Map;


public class DistributionBuilder extends AbstractBuilder {
    private static Logger logger = LoggerFactory.getLogger(DistributionBuilder.class);

    protected final Model model;
    protected final Map<String, Map<String, SkosCode>> codes;


    public DistributionBuilder(Model model, Map<String, Map<String, SkosCode>> codes) {
        this.model = model;
        this.codes = codes;
    }

    public List<Distribution> build() {
        List<Distribution> distributions = new ArrayList<>();

        ResIterator catalogIterator = model.listResourcesWithProperty(RDF.type, DCAT.Catalog);
        while (catalogIterator.hasNext()) {
            Resource catalog = catalogIterator.next();

            StmtIterator datasetIterator = catalog.listProperties(DCAT.dataset);

            while (datasetIterator.hasNext()) {
                Resource dataset = datasetIterator.next().getResource();
                StmtIterator distributionIterator = dataset.listProperties(DCAT.distribution);

                while (distributionIterator.hasNext()) {
                    Statement next = distributionIterator.nextStatement();

                    if (next.getObject().isResource()) {
                        Resource distribution = next.getResource();
                        distributions.add(create(distribution, codes));
                    }
                }
            }
        }

        return distributions;
    }

    // Helper method used to compare substrings of two strings starting with first forward slash, intended to be used to compare if URLS are equal when disregarding protocol.
    static boolean compareURLs(String distributionURL, String openURL) {
        if (distributionURL == null || openURL == null) {
            return false;
        }
        distributionURL = distributionURL.replaceFirst("^.*//", "");
        openURL = openURL.replaceFirst("^.*//", "");
        return distributionURL.startsWith(openURL);
    }

    public static Distribution create(Resource distResource,
                                      Map<String, Map<String, SkosCode>> codes) {
        Distribution dist = new Distribution();

        if (distResource != null) {
            dist.setId(null);
            dist.setUri(distResource.getURI());

            dist.setTitle(extractLanguageLiteral(distResource, DCTerms.title));
            dist.setDescription(extractLanguageLiteral(distResource, DCTerms.description));
            dist.setAccessURL(extractUriList(distResource, DCAT.accessUrl));
            dist.setDownloadURL(extractUriList(distResource, DCAT.downloadUrl));
            dist.setOpenLicense(false);

            List<SkosConcept> licenses = extractSkosConcept(distResource, DCTerms.license);

            if (licenses != null && licenses.size() > 0) {
                SkosConcept firstLicense = licenses.get(0);

                // can we add a prefLabel on a uri with an open license
                if (codes != null && firstLicense.getPrefLabel() == null) {
                    Map<String, SkosCode> licenseCodeMap = codes.get(Types.openlicenses.getType());
                    if (licenseCodeMap != null) {
                        licenseCodeMap.forEach((key, code) -> {
                            if(compareURLs(firstLicense.getUri(), code.getUri())) {
                                firstLicense.setPrefLabel(code.getPrefLabel());
                                dist.setOpenLicense(true);
                            }
                        });
                    }
                }

                dist.setLicense(firstLicense);

                if (licenses.size() > 1) {
                    logger.warn("There are more than one recommended license in input data. Only first will be kept");
                }
            };

            dist.setConformsTo(extractSkosConcept(distResource, DCTerms.conformsTo));
            dist.setPage(extractSkosConcept(distResource, FOAF.page));
            dist.setFormat(extractMultipleStringsExcludeBaseUri(distResource, DCTerms.format));


            dist.setType(extractAsString(distResource, DCTerms.type));

            dist.setAccessService(getDataDistributionService(distResource));

        }

        return dist;
    }


    public static DataDistributionService getDataDistributionService(Resource distResource) {
        StmtIterator distributionServiceIterator = distResource.listProperties(DCATapi.accessService);

        if(distributionServiceIterator.hasNext()){
            //we only allow one DataDistributionService per distribution
            Statement next = distributionServiceIterator.next();
            if(next.getObject().isResource()) {
                Resource distributionService = next.getResource();
                return DataDistributionServiceBuilder.create(distributionService);

            } else {
                return null;
            }
        } else {
            return null;
        }
    }

}
