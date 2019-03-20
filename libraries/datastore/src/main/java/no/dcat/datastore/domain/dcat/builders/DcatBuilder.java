package no.dcat.datastore.domain.dcat.builders;

import no.dcat.datastore.domain.dcat.vocabulary.ADMS;
import no.dcat.datastore.domain.dcat.vocabulary.AT;
import no.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import no.dcat.datastore.domain.dcat.vocabulary.DCATapi;
import no.dcat.datastore.domain.dcat.vocabulary.DQV;
import no.dcat.datastore.domain.dcat.vocabulary.OA;
import no.dcat.shared.Catalog;
import no.dcat.shared.Contact;
import no.dcat.shared.Dataset;
import no.dcat.shared.Distribution;
import no.dcat.shared.DataDistributionService;
import no.dcat.shared.PeriodOfTime;
import no.dcat.shared.Publisher;
import no.dcat.shared.QualityAnnotation;
import no.dcat.shared.Reference;
import no.dcat.shared.SkosCode;
import no.dcat.shared.SkosConcept;
import no.dcat.shared.Subject;
import org.apache.jena.datatypes.xsd.XSDDatatype;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCAT;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
import org.apache.jena.vocabulary.VCARD4;
import org.apache.jena.vocabulary.XSD;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Created by dask on 10.04.2017.
 */
public class DcatBuilder {
    private final static Logger logger = LoggerFactory.getLogger(DcatBuilder.class);
    private static final SimpleDateFormat sdfDateTime = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
    private static final SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");

    public static final Model mod = ModelFactory.createDefaultModel();

    static Property schema_startDate = mod.createProperty("http://schema.org/startDate");
    static Property schema_endDate = mod.createProperty("http://schema.org/endDate");

    Map<String, Contact> exportedContacsUriMap = new HashMap<>();
    Set<Contact> exportedContacts = new HashSet<>();

    private final Model model;

    public DcatBuilder() {
        model = ModelFactory.createDefaultModel();
        model.setNsPrefix("dct", DCTerms.NS);
        model.setNsPrefix("dcat", DCAT.NS);
        model.setNsPrefix("foaf", FOAF.NS);
        model.setNsPrefix("vcard", VCARD4.NS);
        model.setNsPrefix("dcatno", DCATNO.NS);
        model.setNsPrefix("dcatapi", DCATapi.NS);
        model.setNsPrefix("xsd", XSD.NS);
        model.setNsPrefix("adms", ADMS.NS);
        model.setNsPrefix("iso", DQV.NS);
        model.setNsPrefix("oa", OA.NS);
        model.setNsPrefix("dqv", DQV.NS);
        model.setNsPrefix("rdf", RDF.uri);
        model.setNsPrefix("skos", SKOS.uri);
        model.setNsPrefix("schema", "http://schema.org/");
    }

    /**
     * Transforms a Catalog object to DCAT format.
     *
     * @param catalog      object to transform
     * @param outputFormat requested format(Jena/arq): TURTLE, RDF/XML, JSONLD
     * @return a string containing the DCAT data in the wanted format
     */
    public static String transform(Catalog catalog, String outputFormat) {

        DcatBuilder builder = new DcatBuilder();
        builder.addCatalog(catalog);

        return builder.getDcatOutput(outputFormat);
    }

    public static String transform(Dataset dataset, String outputFormat) {
        DcatBuilder builder = new DcatBuilder();
        builder.addDataset(dataset);

        return builder.getDcatOutput(outputFormat);
    }

    public String getDcatOutput(String outputFormat) {
        OutputStream out = new ByteArrayOutputStream();
        model.write(out, outputFormat);

        return out.toString();
    }

    public Model getModel() {
        return model;
    }

    public DcatBuilder addCatalog(Catalog catalog) {

        Resource catRes = createResource(catalog, catalog.getUri(), DCAT.Catalog);
        addLiterals(catRes, DCTerms.title, catalog.getTitle());
        addLiterals(catRes, DCTerms.description, catalog.getDescription());

        addPublisher(catRes, DCTerms.publisher, catalog.getPublisher());

        addDatasets(catRes, catalog.getDataset());

        return this;
    }

    public DcatBuilder addDataset(Dataset dataset) {

        addDatasets(null, Arrays.asList(dataset));

        return this;
    }

    public DcatBuilder addDatasets(Resource catRes, List<Dataset> datasets) {
        if (datasets != null) {
            for (Dataset dataset : datasets) {
                if (dataset != null) {
                    try {
                        if (catRes != null) {
                            addProperty(catRes, DCAT.dataset, dataset.getUri());
                        }

                        Resource datRes = createResource(dataset, dataset.getUri(), DCAT.Dataset);

                        addPublisher(datRes, DCTerms.publisher, dataset.getPublisher());

                        addLiterals(datRes, DCTerms.title, dataset.getTitle());
                        addLiterals(datRes, DCTerms.description, dataset.getDescription());
                        addLiterals(datRes, DCATNO.objective, dataset.getObjective());

                        addContactPoints(datRes, dataset.getContactPoint());
                        addKeywords(datRes, dataset.getKeyword());

                        addDateTimeLiteral(datRes, DCTerms.issued, dataset.getIssued());
                        addDateLiteral(datRes, DCTerms.modified, dataset.getModified());

                        addSkosCodes(datRes, DCTerms.language, dataset.getLanguage(), DCTerms.LinguisticSystem);
                        addProperties(datRes, DCAT.landingPage, dataset.getLandingPage());
                        addUriProperties(datRes, DCAT.theme, dataset.getTheme());

                        addDistributions(datRes, DCAT.distribution, dataset.getDistribution());
                        addDistributions(datRes, ADMS.sample, dataset.getSample());

                        addTemporal(dataset, datRes);
                        addUriProperties(datRes, DCTerms.spatial, dataset.getSpatial());

                        addProperty(datRes, DCTerms.accessRights, dataset.getAccessRights());
                        addProperties(datRes, DCATNO.accessRightsComment, dataset.getAccessRightsComment());
                        addSkosProperties(datRes, DCATNO.legalBasisForAccess, dataset.getLegalBasisForAccess(), DCTerms.RightsStatement);
                        addSkosProperties(datRes, DCATNO.legalBasisForProcessing, dataset.getLegalBasisForProcessing(), DCTerms.RightsStatement);
                        addSkosProperties(datRes, DCATNO.legalBasisForRestriction, dataset.getLegalBasisForRestriction(), DCTerms.RightsStatement);

                        addQualityAnnotation(datRes, DQV.hasQualityAnnotation, dataset.getHasAccuracyAnnotation());
                        addQualityAnnotation(datRes, DQV.hasQualityAnnotation, dataset.getHasAvailabilityAnnotation());
                        addQualityAnnotation(datRes, DQV.hasQualityAnnotation, dataset.getHasCompletenessAnnotation());
                        addQualityAnnotation(datRes, DQV.hasQualityAnnotation, dataset.getHasCurrentnessAnnotation());
                        addQualityAnnotation(datRes, DQV.hasQualityAnnotation, dataset.getHasRelevanceAnnotation());

                        addReferences(datRes, dataset.getReferences());
                        addProperty(datRes, DCTerms.provenance, dataset.getProvenance());
                        addStringLiterals(datRes, DCTerms.identifier, dataset.getIdentifier());

                        addProperties(datRes, FOAF.page, dataset.getPage());
                        addProperty(datRes, DCTerms.accrualPeriodicity, dataset.getAccrualPeriodicity());
                        addSubjects(datRes, DCTerms.subject, dataset.getSubject());

                        addProperties(datRes, ADMS.identifier, dataset.getAdmsIdentifier());
                        addSkosProperties(datRes, DCATNO.informationModel, dataset.getInformationModel(), DCTerms.Standard);
                        addSkosProperties(datRes, DCTerms.conformsTo, dataset.getConformsTo(), DCTerms.Standard);

                        addLiteral(datRes, DCTerms.type, dataset.getType());
                    } catch (Exception e) {
                        logger.error("Unable to export dataset {} to DCAT. Reason {}", dataset.getId(), e.getLocalizedMessage(), e);
                    }
                }
            }
        }

        return this;
    }

    private void addKeywords(Resource datRes, List<Map<String, String>> keywords) {
        if (keywords != null) {
            for (Map<String, String> keyword : keywords) {
                addLiterals(datRes, DCAT.keyword, keyword);
            }
        }
    }

    private void addTemporal(Dataset dataset, Resource datRes) {
        if (dataset.getTemporal() != null) {
            for (PeriodOfTime period : dataset.getTemporal()) {
                addPeriodOfTimeResource(datRes, DCTerms.temporal, period);
            }
        }
    }

    boolean hasContent(Map<String, String> label) {
        if (label == null || label.isEmpty()) {
            return false;
        } else {
            int[] emptyValue = {0};
            label.forEach((key, value) -> {
                if (value == null || value.isEmpty()) {
                    emptyValue[0]++;
                }
            });
            if (emptyValue[0] == label.size())
                return false;
        }
        return true;
    }

    boolean isNullOrEmpty(String value) {
        if (value == null) return true;

        if (value.isEmpty()) return true;

        return false;
    }

    private void addReferences(Resource datRes, List<Reference> references) {
        if (references != null && references.size() > 0) {
            references.forEach(reference -> {
                addReference(datRes, reference);
            });
        }
    }

    private void addReference(Resource datRes, Reference reference) {
        if (reference != null) {

            SkosCode referenceType = reference.getReferenceType();
            SkosConcept source = reference.getSource();

            if (referenceType == null || source == null) {
                return;
            }

            if (isNullOrEmpty(referenceType.getUri()) && isNullOrEmpty(referenceType.getCode())) {
                return;
            }

            if (isNullOrEmpty(source.getUri())) {
                return;
            }

            String referencePropertyUri;
            if (!isNullOrEmpty(referenceType.getCode())){
                String code = referenceType.getCode();
                if (code.startsWith("dct:")) {
                    // TODO hack to fix error in reference-data/registration
                    code = code.replaceFirst("dct:", "");
                }

                if (code.startsWith(DCTerms.NS)) {
                    referencePropertyUri = code;
                } else {
                    referencePropertyUri = DCTerms.getURI() + code;
                }
            } else {
                referencePropertyUri = referenceType.getUri();
            }

            Property referenceProperty = model.createProperty(referencePropertyUri);

            Map<String, String> prefLabel = source.getPrefLabel();
            if (hasContent(prefLabel)) {
                Resource r = model.createResource();
                r.addProperty(RDF.type, DCAT.Dataset);
                addLiterals(r, SKOS.prefLabel, prefLabel);
                r.addProperty(DCTerms.source, model.createResource(source.getUri()));
                datRes.addProperty(referenceProperty, r);

            } else {
                Resource r = model.createResource(source.getUri());
                datRes.addProperty(referenceProperty, r);
            }
        }
    }


    private void addQualityAnnotation(Resource datRes, Property hasQualityAnnotation, QualityAnnotation annotation) {
        if (annotation != null) {
            Resource qualityAnnotation = model.createResource();

            qualityAnnotation.addProperty(RDF.type, DQV.QualityAnnotation);
            datRes.addProperty(hasQualityAnnotation, qualityAnnotation);

            Resource dimension = DQV.resolveDimensionResource(annotation.getInDimension());
            if (dimension == null) {
                logger.warn("Unable to export quality annotation for {} with body {}", annotation.getInDimension(), annotation.getHasBody().toString());
                return;
            }
            qualityAnnotation.addProperty(DQV.inDimension, dimension);

            Resource body = model.createResource();
            addLiterals(body, RDF.value, annotation.getHasBody());

            qualityAnnotation.addProperty(OA.hasBody, body);
        }
    }

    DcatBuilder addSkosConcepts(Resource datRes, Property property, List<SkosConcept> concepts, Resource type) {
        if (concepts != null) {
            concepts.forEach(concept -> {
                addSkosConcept(datRes, property, concept, type);
            });
        }

        return this;
    }

    public DcatBuilder addSkosConcept(Resource datRes, Property predicate, SkosConcept skosConcept, Resource type) {
        if (skosConcept != null && skosConcept.getUri() != null && !skosConcept.getUri().isEmpty()) {
            Resource skosConceptResource = model.createResource();

            skosConceptResource.addProperty(RDF.type, SKOS.Concept);
            skosConceptResource.addProperty(RDF.type, type);

            if (skosConcept.getExtraType() != null) {
                if (skosConcept.getExtraType() != null && skosConcept.getExtraType().contains("Standard")) {
                    skosConceptResource.addProperty(RDF.type, DCTerms.Standard);
                }
            }
            skosConceptResource.addProperty(DCTerms.source, skosConcept.getUri());
            if (hasContent(skosConcept.getPrefLabel())) {
                addLiterals(skosConceptResource, SKOS.prefLabel, skosConcept.getPrefLabel());
            }

            datRes.addProperty(predicate, skosConceptResource);
        }

        return this;
    }


    public DcatBuilder addPeriodOfTimeResource(Resource resource, Property property, PeriodOfTime period) {
        if (period != null) {

            if (period.getStartDate() != null || period.getEndDate() != null) {
                Resource temporal = model.createResource();
                model.add(temporal, RDF.type, DCTerms.PeriodOfTime);

                resource.addProperty(property, temporal);

                if (period.getStartDate() != null) {
                    addDateLiteral(temporal, schema_startDate, period.getStartDate());
                }
                if (period.getEndDate() != null) {
                    addDateLiteral(temporal, schema_endDate, period.getEndDate());
                }
            }
        }

        return this;
    }


    public DcatBuilder addDateTimeLiteral(Resource resource, Property property, Date date) {
        if (date != null) {
            Literal literal = model.createTypedLiteral(sdfDateTime.format(date), XSDDatatype.XSDdateTime);
            model.addLiteral(resource, property, literal);
        }
        return this;
    }

    public DcatBuilder addDateLiteral(Resource resource, Property property, Date date) {
        if (date != null) {
            Literal literal = model.createTypedLiteral(sdfDate.format(date), XSDDatatype.XSDdate);
            model.addLiteral(resource, property, literal);
        }
        return this;
    }

    public DcatBuilder addPublisher(Resource resource, Property property, Publisher publisher) {
        String publisherId = "";

        if (publisher != null) {
            try {
                Resource publisherResource = null;
                if (publisher.getUri() != null && !publisher.getUri().isEmpty()) {
                    publisherId = publisher.getUri();
                    publisherResource = model.createResource(publisher.getUri());
                } else {
                    if (publisher.getId() != null && !publisher.getId().isEmpty()){
                        publisherId = publisher.getId();
                        publisherResource = model.createResource(publisher.getId());
                    } else {
                        publisherResource = model.createResource();
                    }
                }

                resource.addProperty(property, publisherResource);
                publisherResource.addProperty(RDF.type, FOAF.Agent);

                addLiteral(publisherResource, FOAF.name, publisher.getName());
                addLiterals(publisherResource, SKOS.prefLabel, publisher.getPrefLabel());
                addLiteral(publisherResource, DCTerms.identifier, publisher.getId());
            } catch (Exception e) {
                logger.error("Unable to export publisher {}. Reason {}", publisherId, e.getLocalizedMessage(), e);
            }
        }
        return this;
    }

    public DcatBuilder addDistributions(Resource dataset, Property property, List<Distribution> distributions) {
        if (distributions != null) {
            for (Distribution distribution : distributions) {
                if (distribution != null) {
                    try {
                        Resource disRes = null;
                        if (distribution.getUri() != null && distribution.getUri().isEmpty()) {
                            disRes = model.createResource(UUID.randomUUID().toString());
                        } else {
                            disRes = model.createResource(distribution.getUri());
                        }

                        addLiterals(disRes, DCTerms.title, distribution.getTitle());
                        addLiterals(disRes, DCTerms.description, distribution.getDescription());
                        addProperties(disRes, DCAT.accessURL, distribution.getAccessURL());
                        addProperties(disRes, DCAT.downloadURL, distribution.getDownloadURL());
                        addSkosConcept(disRes, DCTerms.license, distribution.getLicense(), DCTerms.LicenseDocument);

                        addSkosConcepts(disRes, DCTerms.conformsTo, distribution.getConformsTo(), DCTerms.Standard);
                        addSkosConcepts(disRes, FOAF.page, distribution.getPage(), FOAF.Document);
                        addLiterals(disRes, DCTerms.format, distribution.getFormat());

                        addLiteral(disRes, DCTerms.type, distribution.getType());

                        addDataDistributionService(distribution.getAccessService(), disRes);


                        if (disRes.getProperty(DCTerms.title) != null ||
                                disRes.getProperty(DCTerms.description) != null ||
                                disRes.getProperty(DCAT.accessURL) != null ||
                                disRes.getProperty(DCTerms.license) != null ||
                                disRes.getProperty(DCTerms.conformsTo) != null ||
                                disRes.getProperty(FOAF.page) != null ||
                                disRes.getProperty(DCTerms.format) != null ||
                                disRes.getProperty(DCATapi.accessService) != null) {
                            disRes.addProperty(RDF.type, DCAT.Distribution);
                            dataset.addProperty(property, disRes);
                        } else {
                            model.removeAll(disRes, null, null);
                            model.removeAll(null, null, disRes);
                        }
                    } catch (Exception e) {
                        logger.error("Unable to export distribution {} to DCAT. Reason {}", distribution.getUri(), e.getLocalizedMessage(), e);
                    }
                }

            }
        }

        return this;
    }


    public DcatBuilder addContactPoints(Resource datRes, List<Contact> contacts) {
        if (contacts != null) {
            for (Contact contact : contacts) {
                createContactPoint(datRes, contact);
            }
        }
        return this;
    }


    void createContactPoint(Resource datRes, Contact contact) {
        if (contact != null) {
            Resource contactRes = null;

            if (    (contact.getFullname() != null && !contact.getFullname().isEmpty()) ||
                    (contact.getEmail() != null && !contact.getEmail().isEmpty()) ||
                    (contact.getHasTelephone() != null && !contact.getHasTelephone().isEmpty()) ||
                    (contact.getHasURL() != null && !contact.getHasURL().isEmpty()) ||
                    (contact.getOrganizationName() != null && !contact.getOrganizationName().isEmpty()) ||
                    (contact.getOrganizationUnit() != null && !contact.getOrganizationUnit().isEmpty())) {

                // contact already exported?
                if (contact.getUri() != null) {
                    if (exportedContacts.contains(contact)) {
                        return;
                    }
                    exportedContacts.add(contact);

                    // contact has same uri as one that has been exported before, force a new one
                    if (exportedContacsUriMap.containsKey(contact.getUri()) && contact != exportedContacsUriMap.get(contact.getUri())) {
                        contact.setUri(AbstractBuilder.CONTACT_PREFIX + "/export/" + UUID.randomUUID().toString());
                    }

                    contactRes = model.createResource(contact.getUri());

                    // remember uri for contact
                    exportedContacsUriMap.put(contact.getUri(), contact);

                } else {
                    // create anonymous contact
                    contactRes = model.createResource();
                }

                contactRes.addProperty(RDF.type, VCARD4.Organization);
                datRes.addProperty(DCAT.contactPoint, contactRes);

                addLiteral(contactRes, VCARD4.fn, contact.getFullname());
                addProperty(contactRes, VCARD4.hasURL, contact.getHasURL());
                addLiteral(contactRes, VCARD4.organization_name, contact.getOrganizationName());
                addLiteral(contactRes, VCARD4.organization_unit, contact.getOrganizationUnit());

                if (contact.getEmail() != null && !contact.getEmail().isEmpty()) {
                    String email = contact.getEmail().replaceAll("\\s", "");
                    if (email.startsWith("mailto:")) {
                        addProperty(contactRes, VCARD4.hasEmail, email);
                    } else {
                        addProperty(contactRes, VCARD4.hasEmail, "mailto:" + email);
                    }
                }

                if (contact.getHasTelephone() != null && !contact.getHasTelephone().isEmpty()) {
                    String telephone = contact.getHasTelephone().replaceAll("\\s", "");
                    if (telephone.startsWith("tel:")) {
                        addProperty(contactRes, VCARD4.hasTelephone, telephone);
                    } else {
                        addProperty(contactRes, VCARD4.hasTelephone, "tel:" + telephone);
                    }
                }


            }
        }
    }

    public Resource createResource(Object o, String uri, Resource resourceType) {
        Resource resource = model.createResource(uri);
        model.add(resource, RDF.type, resourceType);

        return resource;
    }


    public DcatBuilder addProperty(Resource resource, Property property, SkosCode code) {
        if (code != null && code.getUri() != null && !code.getUri().isEmpty()) {
            Resource r = model.createResource(code.getUri());
            resource.addProperty(property, r);
        }

        return this;
    }

    public DcatBuilder addSkosCodes(Resource resource, Property property, List<SkosCode> codes, Resource type) {
        if (codes != null) {

            codes.forEach(code -> this.addSkosCode(resource, property, code, type));
        }
        return this;
    }

    public DcatBuilder addSkosCode(Resource resource, Property property, SkosCode code, Resource type) {
        if (code != null) {
            Resource r = model.createResource(code.getUri());
            r.addProperty(RDF.type, type);

            if (hasContent(code.getPrefLabel())) {
                addLiterals(r, SKOS.prefLabel, code.getPrefLabel());
            }
            addLiteral(r, AT.authorityCode, code.getCode());

            resource.addProperty(property, r);
        }
        return this;
    }

    public DcatBuilder addSubjects(Resource resource, Property property, List<Subject> subjects) {
        if (subjects != null) {
            for (Subject subject : subjects) {
                if (subject.getUri() != null && !subject.getUri().isEmpty()) {
                    Resource r = model.createResource(subject.getUri());

                    addSubjectContent(subject, r);

                    resource.addProperty(DCTerms.subject, r);
                }

            }
        }
        return this;
    }

    public void addSubjectContent(Subject subject, Resource resource) {
        if (subject.getPrefLabel() != null) {
            resource.addProperty(RDF.type, SKOS.Concept);

            addLiteral(resource, DCTerms.identifier, subject.getIdentifier());

            addLiterals(resource, SKOS.prefLabel, subject.getPrefLabel());
            addLiteralsMultipleLabels(resource, SKOS.altLabel, subject.getAltLabel());

            addLiterals(resource, SKOS.definition, subject.getDefinition());
            addLiterals(resource, SKOS.note, subject.getNote());
            addLiteral(resource, DCTerms.source, subject.getSource());

            addPublisher(resource, DCTerms.creator, subject.getCreator());

            addLiterals(resource, SKOS.inScheme, subject.getInScheme());
        }
    }

    public void addDataDistributionService(DataDistributionService distributionService, Resource resource) {
        if (distributionService != null) {
            try {
                Resource distributionServiceRes = null;
                if (distributionService.getUri() != null) {
                    distributionServiceRes = model.createResource(distributionService.getUri());
                } else {
                    distributionServiceRes = model.createResource(UUID.randomUUID().toString());
                }

                distributionServiceRes.addProperty(RDF.type, DCATapi.DataDistributionService);

                addLiteral(distributionServiceRes, DCTerms.identifier, distributionService.getId());
                addLiterals(distributionServiceRes, DCTerms.title, distributionService.getTitle());
                addLiterals(distributionServiceRes, DCTerms.description, distributionService.getDescription());
                addPublisher(distributionServiceRes, DCTerms.publisher, distributionService.getPublisher());
                addSkosConcepts(distributionServiceRes, DCATapi.endpointDescription, distributionService.getEndpointDescription(), FOAF.Document);

                resource.addProperty(DCATapi.accessService, distributionServiceRes);

            } catch (Exception e) {
                logger.error("Unable to export dataDistributionService {}. Reason {}", distributionService.getTitle(), e.getLocalizedMessage(), e);
            }
        }
    }


    public DcatBuilder addSkosProperties(Resource resource, Property property, List<SkosConcept> concepts, Resource type) {
        if (concepts != null) {
            for (SkosConcept concept : concepts) {
                addSkosConcept(resource, property, concept, type);
            }
        }
        return this;
    }

    public DcatBuilder addProperties(Resource resource, Property property, List<String> uris) {
        if (uris != null) {
            for (String uri : uris) {
                addProperty(resource, property, uri);
            }
        }
        return this;
    }

    public DcatBuilder addUriProperty(Resource resource, Property property, Object objectWithUri) {
        if (objectWithUri != null) {
            try {
                Method m = objectWithUri.getClass().getMethod("getUri");
                String uri = (String) m.invoke(objectWithUri);
                if (uri != null && !uri.isEmpty()) {
                    addProperty(resource, property, uri);
                }
            } catch (Exception e) {
                logger.error("Unable to add URI to {}", property.getLocalName(), e);
            }
        }
        return this;
    }

    public DcatBuilder addUriProperties(Resource resource, Property property, List<?> uris) {
        if (uris != null) {
            for (Object obj : uris) {
                addUriProperty(resource, property, obj);
            }
        }

        return this;
    }

    public DcatBuilder addStringLiterals(Resource resource, Property property, List<String> values) {
        if (values != null) {
            for (String value : values) {
                addLiteral(resource, property, value);
            }
        }

        return this;
    }

    public DcatBuilder addProperty(Resource resource, Property property, String uri) {
        if (uri != null && !uri.isEmpty()) {
            Resource r = model.createResource(uri);
            resource.addProperty(property, r);
        }

        return this;
    }

    public DcatBuilder addLiterals(Resource resource, Property property, List<String> values) {
        if (values != null) {
            for (String value : values) {
                if (value != null && !value.isEmpty()) {
                    Literal literal = model.createLiteral(value);
                    resource.addProperty(property, literal);
                }
            }
        }

        return this;
    }

    public DcatBuilder addLiteralsMultipleLabels(Resource resource, Property property, List<Map<String, String>> languageMaps) {
        if (languageMaps != null && !languageMaps.isEmpty()) {

            languageMaps.forEach( languageMap -> {
                addLiterals(resource, property, languageMap);
            });

        }
        return this;
    }

    public DcatBuilder addLiterals(Resource resource, Property property, Map<String, String> languageMap) {
        if (hasContent(languageMap)) {

            languageMap.forEach((lang, value) -> {
                if (value != null && !value.isEmpty()) {
                    Literal literal = model.createLiteral(value, lang);
                    resource.addProperty(property, literal);
                }
            });
        }
        return this;
    }

    public DcatBuilder addLiteral(Resource resource, Property property, String value) {
        if (value != null && !value.isEmpty()) {
            Literal literal = model.createLiteral(value);
            resource.addProperty(property, literal);
        }
        return this;
    }
}
