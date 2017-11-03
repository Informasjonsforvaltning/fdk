package no.difi.dcat.datastore.domain.dcat.builders;

import no.dcat.shared.*;
import no.difi.dcat.datastore.domain.dcat.vocabulary.*;
import org.apache.jena.rdf.model.*;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static java.util.Collections.singletonList;

public class DatasetBuilder extends AbstractBuilder {
    private final static Logger logger = LoggerFactory.getLogger(DatasetBuilder.class);

    protected final Model model;
    protected final Map<String, SkosCode> locations;
    protected final Map<String, Map<String, SkosCode>> codes;
    protected final Map<String, DataTheme> dataThemes;

    public DatasetBuilder(Model model, Map<String, SkosCode> locations, Map<String, Map<String, SkosCode>> codes,
                          Map<String, DataTheme> dataThemes) {
        super();

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
                Resource datasetResource = datasetIterator.next().getResource();

                Dataset datasetObject = create(datasetResource, catalog, locations, codes, dataThemes);
                datasetObject.setDistribution(getDistributions(datasetResource, DCAT.distribution));
                datasetObject.setSample(getDistributions(datasetResource, DCAT.sample));

                datasets.add(datasetObject);
            }
        }

        return datasets;
    }

    private List<Distribution> getDistributions(Resource resource, Property property) {
        StmtIterator distributionIterator = resource.listProperties(property);
        List<Distribution> distributions = new ArrayList<>();
        while (distributionIterator.hasNext()) {
            Statement next = distributionIterator.nextStatement();


            if (next.getObject().isResource()) {
                Resource distribution = next.getResource();
                distributions.add(DistributionBuilder.create(distribution, null, null, null,
                        null, null));
            }

        }
        if (distributions.size() > 0) {
            return distributions;
        }

        return null;
    }

    public static Dataset create(Resource resource, Resource catalog, Map<String, SkosCode> locations,
                                 Map<String, Map<String, SkosCode>> codes, Map<String, DataTheme> dataThemes) {
        Dataset ds = new Dataset();

        if (resource != null) {

            ds.setId(resource.getURI());
            ds.setUri(resource.getURI());

            ds.setSource(extractAsString(resource, DCATNO.source));

            ds.setTitle(extractLanguageLiteral(resource, DCTerms.title));
            ds.setDescription(extractLanguageLiteral(resource, DCTerms.description));
            ds.setObjective(extractLanguageLiteral(resource, DCATNO.objective));

            ds.setContactPoint(asList(extractContact(resource)));
            ds.setKeyword(extractKeywords(resource, DCAT.keyword));
            ds.setPublisher(extractPublisher(resource));

            ds.setIssued(extractDate(resource, DCTerms.issued));
            ds.setModified(extractDate(resource, DCTerms.modified));

            ds.setLanguage(asList(getCode(codes.get(Types.linguisticsystem.getType()), extractAsString(resource, DCTerms.language))));
            ds.setLandingPage(asList(extractAsString(resource, DCAT.landingPage)));
            ds.setTheme(extractTheme(resource, DCAT.theme, dataThemes));

            // distributions handled externally
            // sample handled externally

            ds.setTemporal(extractPeriodOfTime(resource));
            ds.setSpatial(getCodes(resource.getModel(), locations, extractMultipleStrings(resource, DCTerms.spatial)));

            ds.setAccessRights(getCode(codes.get(Types.rightsstatement.getType()),extractAsString(resource, DCTerms.accessRights)));
            ds.setAccessRightsComment(extractMultipleStrings(resource, DCATNO.accessRightsComment));
            ds.setLegalBasisForAccess(extractSkosConcept(resource, DCATNO.legalBasisForAccess));
            ds.setLegalBasisForProcessing(extractSkosConcept(resource, DCATNO.legalBasisForProcessing));
            ds.setLegalBasisForRestriction(extractSkosConcept(resource, DCATNO.legalBasisForRestriction));

            ds.setHasAccuracyAnnotation(extractQualityAnnotation(resource,QualityAnnotation.Accuracy));
            ds.setHasAvailabilityAnnotation(extractQualityAnnotation(resource,QualityAnnotation.Availability));
            ds.setHasCompletenessAnnotation(extractQualityAnnotation(resource,QualityAnnotation.Completeness));
            ds.setHasCurrentnessAnnotation(extractQualityAnnotation(resource,QualityAnnotation.Currentness));
            ds.setHasRelevanceAnnotation(extractQualityAnnotation(resource,QualityAnnotation.Relevance));

            ds.setReferences(extractReferences(resource, codes.get(Types.referencetypes.getType())));
            ds.setProvenance(getCode(codes.get(Types.provenancestatement.getType()), extractAsString(resource, DCTerms.provenance)));
            ds.setIdentifier(extractMultipleStrings(resource, DCTerms.identifier));

            ds.setPage(extractMultipleStrings(resource, FOAF.page));
            ds.setAccrualPeriodicity(getCode(codes.get(Types.frequency.getType()), extractAsString(resource, DCTerms.accrualPeriodicity)));
            ds.setSubject(extractSubjects(resource, DCTerms.subject));

            ds.setAdmsIdentifier(extractMultipleStrings(resource, ADMS.identifier));
            ds.setConformsTo(extractSkosConcept(resource, DCTerms.conformsTo));
            ds.setInformationModel(extractSkosConcept(resource, DCATNO.informationModel));

            ds.setType(extractAsString(resource, DCTerms.type));

        }
        if (catalog != null) {
            ds.setCatalog(CatalogBuilder.create(catalog));
        }

        return ds;
    }



    public static QualityAnnotation extractQualityAnnotation(Resource resource, String dimensionUri) {
        assert dimensionUri != null;

        QualityAnnotation result = null;

        StmtIterator iterator = resource.listProperties(DQV.hasQualityAnnotation);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();

            Resource annotation = statement.getResource();
            Statement dimension = annotation.getProperty(DQV.inDimension);

            if (dimension != null && annotation != null) {
                String actualDimensionUri = dimension.getObject().toString();
                String expandedDimensionUri = resource.getModel().expandPrefix(actualDimensionUri);

                if (dimensionUri.equals(expandedDimensionUri)) {
                    Statement body = annotation.getProperty(OA.hasBody);

                    Map<String, String> annotationText = extractLanguageLiteral(body.getResource(), RDF.value);
                    if (annotationText != null) {
                        result = new QualityAnnotation();
                        result.setHasBody(annotationText);
                        result.setInDimension(dimension.getObject().toString());
                    }
                }
            }

        }
        return result;
    }

    public static List<DataTheme> extractTheme(Resource resource, Property property, Map<String, DataTheme> dataThemes) {
        List<DataTheme> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);

        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            String themeCode = statement.getObject().toString();

            DataTheme dataTheme = dataThemes.get(themeCode);

            if (dataTheme == null) {
                logger.warn(String.format("Themecode %s does not exist and will be ignored", themeCode));
            } else {
                result.add(dataTheme);
            }
        }
        return result;
    }

}
