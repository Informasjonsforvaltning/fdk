package no.difi.dcat.datastore.domain.dcat.builders;

import no.dcat.shared.DataTheme;
import no.dcat.shared.SkosCode;
import no.difi.dcat.datastore.domain.dcat.*;
import no.difi.dcat.datastore.domain.dcat.vocabulary.ADMS;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import org.apache.jena.rdf.model.*;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import no.dcat.shared.Types;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DatasetBuilder extends AbstractBuilder {
    private final static Logger logger = LoggerFactory.getLogger(DatasetBuilder.class);

    protected final Model model;
    protected final Map<String, SkosCode> locations;
    protected final Map<String, Map<String, SkosCode>> codes;
    protected final Map<String, DataTheme> dataThemes;

    public DatasetBuilder(Model model, Map<String, SkosCode> locations, Map<String, Map<String, SkosCode>> codes,
                          Map<String, DataTheme> dataThemes) {
        this.model = model;
        this.locations = locations;
        this.codes = codes;
        this.dataThemes = dataThemes;
    }

    public List<Dataset> build() {

        List<Dataset> datasets = new ArrayList<>();

        ResIterator catalogIterator = model.listResourcesWithProperty(RDF.type, DCAT.Catalog);
        while (catalogIterator.hasNext()) {
            Resource catalog = catalogIterator.next();
            StmtIterator datasetIterator = catalog.listProperties(DCAT.dataset);


            while (datasetIterator.hasNext()) {
                Resource dataset = datasetIterator.next().getResource();
                Dataset datasetObj = create(dataset, catalog, locations, codes, dataThemes);
                StmtIterator distributionIterator = dataset.listProperties(DCAT.distribution);
                List<Distribution> distributions = new ArrayList<>();
                while (distributionIterator.hasNext()) {
                    Statement next = distributionIterator.nextStatement();


                    if (next.getObject().isResource()) {
                        Resource distribution = next.getResource();
                        distributions.add(DistributionBuilder.create(distribution, null, null, null,
                                null, null));
                    }

                }
                datasetObj.setDistribution(distributions);
                datasets.add(datasetObj);
            }
        }

        return datasets;
    }

    public static Dataset create(Resource dataset, Resource catalog, Map<String, SkosCode> locations,
                                 Map<String, Map<String, SkosCode>> codes, Map<String, DataTheme> dataThemes) {
        Dataset created = new Dataset();

        if (dataset != null) {
            created.setId(dataset.getURI());
            created.setTitle(extractLanguageLiteral(dataset, DCTerms.title));
            created.setIdentifier(extractMultipleStrings(dataset, DCTerms.identifier));
            created.setDescription(extractLanguageLiteral(dataset, DCTerms.description));
            created.setIssued(extractDate(dataset, DCTerms.issued));
            created.setModified(extractDate(dataset, DCTerms.modified));
            created.setLanguage(getCode(codes.get(Types.linguisticsystem.getType()), extractAsString(dataset, DCTerms.language)));

            created.setLandingPage(extractAsString(dataset, DCAT.landingPage));
            created.setKeyword(extractMultipleLanguageLiterals(dataset, DCAT.keyword));
            created.setContactPoint(extractContact(dataset));
            created.setPublisher(extractPublisher(dataset));
            created.setTheme(extractTheme(dataset, DCAT.theme, dataThemes));
			created.setConformsTo(extractMultipleStrings(dataset, DCTerms.conformsTo));
            created.setPage(extractMultipleStrings(dataset, FOAF.page));
            created.setAccrualPeriodicity(getCode(codes.get(Types.frequency.getType()), extractAsString(dataset, DCTerms.accrualPeriodicity)));

            created.setTemporal(extractPeriodOfTime(dataset));
			created.setSpatial(getCodes(locations, extractMultipleStrings(dataset, DCTerms.spatial)));
			created.setAccessRights(getCode(codes.get(Types.rightsstatement.getType()), extractAsString(dataset, DCTerms.accessRights)));
			created.setAccessRightsComment(extractMultipleStrings(dataset, DCATNO.accessRightsComment));
            created.setSubject(extractMultipleStrings(dataset, DCTerms.subject));
			created.setReferences(extractMultipleStrings(dataset, DCTerms.references));
			created.setProvenance(getCode(codes.get(Types.provenancestatement.getType()), extractAsString(dataset, DCTerms.provenance)));
            created.setADMSIdentifier(extractMultipleStrings(dataset, ADMS.identifier));
            created.setType(extractAsString(dataset, DCTerms.type));
		}
        if (catalog != null) {
            created.setCatalog(CatalogBuilder.create(catalog));
        }

        return created;
    }

    public static List<DataTheme> extractTheme(Resource resource, Property property, Map<String, DataTheme> dataThemes) {
        List<DataTheme> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);

        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            String themeCode = statement.getObject().toString();

            DataTheme dataTheme = dataThemes.get(themeCode);

            if (dataTheme == null) {
                logger.warn(String.format("Themecode %s does not exist", themeCode));
            } else {
                result.add(dataTheme);
            }
        }
        return result;
    }

}
