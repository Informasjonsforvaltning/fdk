package no.difi.dcat.datastore.domain.dcat.builders;

import no.dcat.shared.Catalog;
import no.dcat.shared.Contact;
import no.dcat.shared.Dataset;
import no.dcat.shared.Distribution;
import no.dcat.shared.PeriodOfTime;
import no.dcat.shared.Publisher;
import no.dcat.shared.QualityAnnotation;
import no.dcat.shared.Reference;
import no.dcat.shared.SkosCode;
import no.dcat.shared.SkosConcept;
import no.dcat.shared.Subject;

import no.difi.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DQV;
import no.difi.dcat.datastore.domain.dcat.vocabulary.OA;
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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by dask on 10.04.2017.
 */
public class DcatBuilder {
    private final static Logger logger = LoggerFactory.getLogger(DcatBuilder.class);
    private static final SimpleDateFormat sdfDateTime = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
    private static final SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd");

    public static final Model mod = ModelFactory.createDefaultModel();

    public static final String TIME = "http://www.w3.org/TR/owl-time/";
    public static final String ADMS = "http://www.w3.org/ns/adms#";



    public static final Resource QUALITY_ANNOTATION = mod.createResource(DQV.NS + "QualityAnnotation");

    public static final Property adms_identifier = mod.createProperty(ADMS, "identifier");

    public static final Resource TIME_INSTANT = mod.createResource(TIME + "Instant");
    public static final Property time_hasBeginning = mod.createProperty(TIME, "hasBeginning");
    public static final Property time_hasEnd = mod.createProperty(TIME, "hasEnd");
    public static final Property time_inXSDDateTime = mod.createProperty(TIME, "inXSDDateTime");

    private final Model model;
    private final Map<Object, Resource> resourceMap = new HashMap<>();

    public DcatBuilder() {
        model = ModelFactory.createDefaultModel();
        model.setNsPrefix("dct", DCTerms.NS);
        model.setNsPrefix("dcat", DCAT.NS);
        model.setNsPrefix("foaf", FOAF.NS);
        model.setNsPrefix("vcard", VCARD4.NS);
        model.setNsPrefix("time", TIME);
        model.setNsPrefix("dcatno", DCATNO.NS);
        model.setNsPrefix("xsd", XSD.NS);
        model.setNsPrefix("adms", ADMS);
        model.setNsPrefix("iso", QualityAnnotation.isoNS);
        model.setNsPrefix("oa", OA.NS);
        model.setNsPrefix("dqv", DQV.NS);
        model.setNsPrefix("rdf", RDF.uri);
        model.setNsPrefix("skos", SKOS.uri);
    }

    /**
     * Transforms a Catalog object to DCAT format.
     *
     * @param catalog object to transform
     * @param outputFormat requested format(Jena/arq): TURTLE, RDF/XML, JSONLD
     * @return a string containing the DCAT data in the wanted format
     */
    public static String transform(Catalog catalog, String outputFormat) {

        DcatBuilder builder = new DcatBuilder();
        builder.addCatalog(catalog);

        OutputStream out = new ByteArrayOutputStream();
        builder.model.write(out, outputFormat);
        return out.toString();
    }

    private DcatBuilder addCatalog(Catalog catalog) {
        Resource catRes = createResource(catalog, catalog.getUri(), DCAT.Catalog);
        addLiterals(catRes, DCTerms.title, catalog.getTitle());
        addLiterals(catRes, DCTerms.description, catalog.getDescription());

        addPublisher(catRes, catalog.getPublisher());

        addDatasets(catRes, catalog.getDataset());

        return this;
    }

    public DcatBuilder addDatasets(Resource catRes, List<Dataset> datasets) {
        if (datasets != null) {
            for (Dataset dataset : datasets) {
                addProperty(catRes, DCAT.dataset, dataset.getUri());

                Resource datRes = createResource(dataset, dataset.getUri(), DCAT.Dataset);

                addLiterals(datRes, DCTerms.title, dataset.getTitle());
                addLiterals(datRes, DCTerms.description, dataset.getDescription());
                addLiterals(datRes, DCATNO.objective, dataset.getObjective());

                addContactPoints(datRes, dataset.getContactPoint());
                addKeywords(datRes, dataset.getKeyword());
                addUriProperty(datRes, DCTerms.publisher, dataset.getPublisher());

                addDateTimeLiteral(datRes, DCTerms.issued, dataset.getIssued());
                addDateLiteral(datRes, DCTerms.modified, dataset.getModified());

                addSkosCodes(datRes, DCTerms.language, dataset.getLanguage());
                addProperties(datRes, DCAT.landingPage, dataset.getLandingPage());
                addUriProperties(datRes, DCAT.theme, dataset.getTheme());

                addDistributions(datRes, dataset.getDistribution());
                addDistributions(datRes, dataset.getSample());

                addTemporal(dataset, datRes);
                addUriProperties(datRes, DCTerms.spatial, dataset.getSpatial());

                addProperty(datRes, DCTerms.rights, dataset.getAccessRights());
                addProperties(datRes, DCATNO.accessRightsComment, dataset.getAccessRightsComment());
                addSkosProperties(datRes, DCATNO.legalBasisForAccess, dataset.getLegalBasisForAccess());
                addSkosProperties(datRes, DCATNO.legalBasisForProcessing, dataset.getLegalBasisForProcessing());
                addSkosProperties(datRes, DCATNO.legalBasisForRestriction, dataset.getLegalBasisForRestriction());

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

                addProperties(datRes, adms_identifier, dataset.getAdmsIdentifier());
                addSkosProperties(datRes, DCATNO.informationModel, dataset.getInformationModel());
                addSkosProperties(datRes, DCTerms.conformsTo, dataset.getConformsTo());

                addProperty(datRes, DCTerms.type, dataset.getType());
            }
        }

        return this;
    }

    private void addKeywords(Resource datRes, List<Map<String,String>> keywords) {
        if (keywords != null) {
            for (Map<String, String> keyword : keywords) {
                addLiterals(datRes, DCAT.keyword, keyword);
            }
        }
    }

    private void addTemporal(Dataset dataset, Resource datRes) {
        if (dataset.getTemporal() != null) {
            for (PeriodOfTime period : dataset.getTemporal()) {
                addPeriodResourceAnnon(datRes, DCTerms.temporal, period);
            }
        }
    }

    private void addReferences(Resource datRes, List<Reference> references) {
        if (references != null && references.size() > 0) {
            references.forEach(reference -> {

                Property referenceProperty = model.createProperty(DCTerms.getURI(), reference.getReferenceType().getCode());
                Resource r = model.createResource(reference.getSource().getUri());
                datRes.addProperty(referenceProperty, r);

            });
        }
    }


    private void addQualityAnnotation(Resource datRes, Property hasQualityAnnotation, QualityAnnotation annotation) {
        if (annotation != null) {
            Resource qualityAnnotation = model.createResource();
            Resource dimension = model.createResource(annotation.getInDimension());
            qualityAnnotation.addProperty(RDF.type, QUALITY_ANNOTATION);

            datRes.addProperty(hasQualityAnnotation, qualityAnnotation);

            qualityAnnotation.addProperty(DQV.inDimension, dimension);

            Resource body = model.createResource();
            addLiterals(body, RDF.value, annotation.getHasBody());

            qualityAnnotation.addProperty(OA.hasBody, body);

        }
    }

    DcatBuilder addSkosConcepts(Resource datRes, Property property, List<SkosConcept> concepts) {
        if (concepts != null) {
            concepts.forEach( concept -> {
                addSkosConcept(datRes, property, concept);
            });
        }

        return this;
    }

    private DcatBuilder addSkosConcept(Resource datRes, Property predicate, SkosConcept skosConcept) {
        if (skosConcept != null) {
            Resource skosConceptResource = model.createResource();

            skosConceptResource.addProperty(RDF.type, SKOS.Concept);
            if (skosConcept.getExtraType() != null) {
                skosConceptResource.addProperty(RDF.type, skosConcept.getExtraType());
            }
            skosConceptResource.addProperty(DCTerms.source, skosConcept.getUri());
            addLiterals(skosConceptResource, SKOS.prefLabel, skosConcept.getPrefLabel());

            datRes.addProperty(predicate, skosConceptResource);
        }

        return this;
    }

    public DcatBuilder addPeriodResourceAnnon(Resource resource, Property property, PeriodOfTime period) {
        if (period != null) {

            Resource temporal = model.createResource();
            model.add(temporal, RDF.type, DCTerms.PeriodOfTime);

            resource.addProperty(property, temporal);

            if (period.getStartDate() != null) {
                temporal.addProperty(time_hasBeginning, createTimeInstantResource(period.getStartDate()));
            }
            if (period.getEndDate() != null) {
                temporal.addProperty(time_hasEnd, createTimeInstantResource(period.getEndDate()));
            }

        }

        return this;
    }

    public Resource createTimeInstantResource(Date date) {
        if (date != null) {
            Resource timeInstant = model.createResource();
            model.add(timeInstant, RDF.type, TIME_INSTANT);

            Literal dateLiteral = model.createTypedLiteral(sdfDateTime.format(date), XSDDatatype.XSDdateTime);
            timeInstant.addProperty(time_inXSDDateTime, dateLiteral);

            return timeInstant;
        }
        return null;
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

    public DcatBuilder addPublisher(Resource resource, Publisher publisher) {
        if (publisher != null) {
            addProperty(resource, DCTerms.publisher, publisher.getUri());

            Resource pubRes = createResource(publisher, publisher.getUri(), FOAF.Agent);

            addLiteral(pubRes, FOAF.name, publisher.getName());
            addLiteral(pubRes, DCTerms.identifier, publisher.getId());
        }
        return this;
    }

    public DcatBuilder addDistributions(Resource dataset, List<Distribution> distributions) {
        if (distributions != null) {
            for (Distribution distribution : distributions) {
                addProperty(dataset, DCAT.distribution, distribution.getUri());

                Resource disRes = createResource(distribution, distribution.getUri(), DCAT.Distribution);

                addLiterals(disRes, DCTerms.title, distribution.getTitle());
                addLiterals(disRes, DCTerms.description, distribution.getDescription());
                addProperties(disRes, DCAT.accessURL, distribution.getAccessURL());
                addProperty(disRes, DCTerms.license, distribution.getLicense());

                addSkosConcepts(disRes, DCTerms.conformsTo, distribution.getConformsTo());
                addSkosConcepts(disRes, FOAF.page, distribution.getPage());
                addLiterals(disRes, DCTerms.format, distribution.getFormat());

                addLiteral(disRes, DCTerms.type, distribution.getType());

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

    private void createContactPoint(Resource datRes, Contact contact) {
        addProperty(datRes, DCAT.contactPoint, contact.getUri());

        Resource contactRes = createResource(contact, contact.getUri(), VCARD4.Organization);

        addLiteral(contactRes, VCARD4.fn, contact.getFullname());
        addProperty(contactRes, VCARD4.hasURL, contact.getHasURL());
        addLiteral(contactRes, VCARD4.organization_name, contact.getOrganizationName());
        addLiteral(contactRes, VCARD4.organization_unit, contact.getOrganizationUnit());

        if (contact.getEmail() != null) {
            if (contact.getEmail().startsWith("mailto:")) {
                addProperty(contactRes, VCARD4.hasEmail, contact.getEmail());
            } else {
                addProperty(contactRes, VCARD4.hasEmail, "mailto:" + contact.getEmail());
            }
        }

        if (contact.getHasTelephone() != null) {
            if (contact.getHasTelephone().startsWith("tel:")) {
                addProperty(contactRes, VCARD4.hasTelephone, contact.getHasTelephone());
            } else {
                addProperty(contactRes, VCARD4.hasTelephone, "tel:" + contact.getHasTelephone());
            }
        }
    }

    public Resource createResource(Object o, String uri, Resource resourceType) {
        Resource resource = model.createResource(uri);
        resourceMap.put(o, resource);
        model.add(resource, RDF.type, resourceType);

        return resource;
    }



    public DcatBuilder addProperty(Resource resource, Property property, SkosConcept concept) {
        if (concept != null && concept.getUri() != null && !"".equals(concept.getUri())) {
            Resource r = model.createResource();
            r.addProperty(DCTerms.source, concept.getUri());
            if (concept.getExtraType() != null && !"".equals(concept.getExtraType())) {
                r.addProperty(RDF.type, concept.getExtraType());
            }
            addLiterals(r, SKOS.prefLabel, concept.getPrefLabel() );
            resource.addProperty(property, r);
        }

        return this;
    }

    public DcatBuilder addProperty(Resource resource, Property property, SkosCode code) {
        if (code != null && code.getUri() != null && !"".equals(code.getUri())) {
            Resource r = model.createResource(code.getUri());
            resource.addProperty(property, r);
        }

        return this;
    }

    public DcatBuilder addSkosCodes(Resource resource, Property property, List<SkosCode> codes) {
        if (codes != null) {
            codes.forEach(code -> this.addProperty(resource, property, code));
        }
        return this;
    }


    public DcatBuilder addSubjects(Resource resource, Property property, List<Subject> concepts) {
        if (concepts != null) {
            for (Subject concept : concepts) {
                //addProperty(resource, property, concept);
            }
        }
        return this;
    }

    public DcatBuilder addSkosProperties(Resource resource, Property property, List<SkosConcept> concepts) {
        if (concepts != null) {
            for (SkosConcept concept : concepts) {
                addProperty(resource, property, concept);
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

    public DcatBuilder addUriProperty(Resource resource, Property property, Object objectWithUri){
        if (objectWithUri != null) {
            try {
                Method m = objectWithUri.getClass().getMethod("getUri");
                String uri = (String) m.invoke(objectWithUri);
                if (!"".equals(uri)) {
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
        if (uri != null && !"".equals(uri)) {
            Resource r = model.createResource(uri);
            resource.addProperty(property, r);
        }

        return this;
    }

    public DcatBuilder addLiterals(Resource resource, Property property, List<String> values) {
        if (values != null) {
            for (String value : values) {
                Literal literal = model.createLiteral(value);
                resource.addProperty(property, literal);
            }
        }

        return this;
    }

    public DcatBuilder addLiterals(Resource resource, Property property, Map<String, String> map) {
        if (map != null) {
            for (String l : map.keySet()) {
                String v = map.get(l);
                if (v != null) {
                    Literal literal = model.createLiteral(v, l);
                    resource.addProperty(property, literal);
                }
            }
        }
        return this;
    }

    public DcatBuilder addLiteral(Resource resource, Property property, String value) {
        if (value != null) {
            Literal literal = model.createLiteral(value);
            resource.addProperty(property, literal);
        }
        return this;
    }
}
