package no.dcat.rdf;

import no.dcat.model.Catalog;
import no.dcat.model.Contact;
import no.dcat.model.Dataset;
import no.dcat.model.Distribution;
import no.dcat.model.PeriodOfTime;
import no.dcat.model.Publisher;
import no.dcat.model.QualityAnnotation;
import no.dcat.model.SkosCode;
import no.dcat.model.SkosConceptWithHomepage;
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
    public static final String DCATNO = "http://difi.no/dcatno#";
    public static final String TIME = "http://www.w3.org/TR/owl-time/";
    public static final String ADMS = "http://www.w3.org/ns/adms#";

    public static final String dqvNS = "http://www.w3.org/ns/dqvNS#";
    public static final String isoNS = "http://iso.org/25012/2008/dataquality/";
    public static final String oaNS  = "http://www.w3.org/ns/prov#";

    public static final Resource QUALITY_ANNOTATION = mod.createResource(dqvNS + "QualityAnnotation");

    public static final Property adms_identifier = mod.createProperty(ADMS, "identifier");

    public static final Resource TIME_INSTANT = mod.createResource(TIME + "Instant");
    public static final Property time_hasBeginning = mod.createProperty(TIME, "hasBeginning");
    public static final Property time_hasEnd = mod.createProperty(TIME, "hasEnd");
    public static final Property time_inXSDDateTime = mod.createProperty(TIME, "inXSDDateTime");

    public static final Property dcatno_legalBasisForRestriction = mod.createProperty(DCATNO, "legalBasisForRestriction");
    public static final Property dcatno_legalBasisForProcessing = mod.createProperty(DCATNO, "legalBasisForProcessing");
    public static final Property dcatno_legalBasisForAccess = mod.createProperty(DCATNO, "legalBasisForAccess");
    public static final Property dcatno_informationModel = mod.createProperty(DCATNO, "informationModel");    
    public static final Property dcatno_standard = mod.createProperty(DCATNO, "standard");

    private final Model model;
    private final Map<Object, Resource> resourceMap = new HashMap<>();

    public DcatBuilder() {
        model = ModelFactory.createDefaultModel();
        model.setNsPrefix("dct", DCTerms.NS);
        model.setNsPrefix("dcat", DCAT.NS);
        model.setNsPrefix("foaf", FOAF.NS);
        model.setNsPrefix("vcard", VCARD4.NS);
        model.setNsPrefix("time", TIME);
        model.setNsPrefix("dcatno", DCATNO);
        model.setNsPrefix("xsd", XSD.NS);
        model.setNsPrefix("adms", ADMS);
        model.setNsPrefix("iso", isoNS);
        model.setNsPrefix("oa", oaNS);
        model.setNsPrefix("dqv", dqvNS);
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

                addContactPoints(datRes, dataset.getContactPoint());

                if (dataset.getKeyword() != null) {
                    for (Map<String, String> keyword : dataset.getKeyword()) {
                        addLiterals(datRes, DCAT.keyword, keyword);
                    }
                }
                addUriProperty(datRes, DCTerms.publisher, dataset.getPublisher());

                addDateTimeLiteral(datRes, DCTerms.issued, dataset.getIssued());
                addDateLiteral(datRes, DCTerms.modified, dataset.getModified());
                if (dataset.getLanguage() != null) {
                  for (SkosCode code : dataset.getLanguage()) {
                    addProperty(datRes, DCTerms.language, code.getUri());
                  }
                }
                addProperties(datRes, DCAT.landingPage, dataset.getLandingPage());
                addUriProperties(datRes, DCAT.theme, dataset.getTheme());

                addDistributions(datRes, dataset.getDistribution());

                addProperties(datRes, DCTerms.conformsTo, dataset.getConformsTo());

                if (dataset.getTemporal() != null) {
                    for (PeriodOfTime period : dataset.getTemporal()) {
                        addPeriodResourceAnnon(datRes, DCTerms.temporal, period);
                    }
                }

                addUriProperties(datRes, DCTerms.spatial, dataset.getSpatial());
                addProperty(datRes, DCTerms.rights, dataset.getAccessRights());

                dataset.getLegalBasisForRestriction().forEach(skosConceptWithHomepage -> {
                    addSkosConceptWithHomepage(datRes, dcatno_legalBasisForRestriction, skosConceptWithHomepage);
                });

                dataset.getLegalBasisForProcessing().forEach(skosConceptWithHomepage -> {
                    addSkosConceptWithHomepage(datRes, dcatno_legalBasisForProcessing, skosConceptWithHomepage);
                });
                dataset.getLegalBasisForAccess().forEach(skosConceptWithHomepage -> {
                    addSkosConceptWithHomepage(datRes, dcatno_legalBasisForAccess, skosConceptWithHomepage);
                });
                
                addSkosConceptWithHomepage(datRes, dcatno_informationModel, dataset.getInformationModel());                
                addSkosConceptWithHomepage(datRes, dcatno_standard, dataset.getStandard());
                addProperties(datRes, DCTerms.references, dataset.getReferences());
                addProperty(datRes, DCTerms.provenance, dataset.getProvenance());
                addStringLiterals(datRes, DCTerms.identifier, dataset.getIdentifier());
                addProperties(datRes, FOAF.page, dataset.getPage());
                addProperty(datRes, DCTerms.accrualPeriodicity, dataset.getAccrualPeriodicity());
                addProperties(datRes, DCTerms.subject, dataset.getSubject());
                addProperty(datRes, DCTerms.type, dataset.getType());
                addProperties(datRes, adms_identifier, dataset.getAdmsIdentifier());

                Property hasQualityAnnotation = model.createProperty(dqvNS +"hasQualityAnnotation");
                addQualityAnnotation(datRes, hasQualityAnnotation, dataset.getHasAccuracyAnnotation());
                addQualityAnnotation(datRes, hasQualityAnnotation, dataset.getHasAvailabilityAnnotation());
                addQualityAnnotation(datRes, hasQualityAnnotation, dataset.getHasCompletenessAnnotation());
                addQualityAnnotation(datRes, hasQualityAnnotation, dataset.getHasCurrentnessAnnotation());
                addQualityAnnotation(datRes, hasQualityAnnotation, dataset.getHasRelevanceAnnotation());
            }
        }

        return this;
    }



    private void addQualityAnnotation(Resource datRes, Property hasQualityAnnotation, QualityAnnotation annotation) {
        if (annotation != null) {
            Resource qualityAnnotation = model.createResource();
            Resource dimension = model.createResource(isoNS + annotation.getInDimension());
            qualityAnnotation.addProperty(RDF.type, QUALITY_ANNOTATION);

            datRes.addProperty(hasQualityAnnotation, qualityAnnotation);

            Property inDimension = model.createProperty(dqvNS + "inDimension");
            qualityAnnotation.addProperty(inDimension, dimension);

            Property hasBody = model.createProperty(oaNS + "hasBody");

            Resource body = model.createResource();
            addLiterals(body, RDF.value, annotation.getHasBody());

            qualityAnnotation.addProperty(hasBody, body);

        }
    }

    private void addSkosConceptWithHomepage(Resource datRes, Property predicate, SkosConceptWithHomepage skosConceptWithHomepage) {
        Resource skosConceptWithHomepageResource = model.createResource();

        skosConceptWithHomepageResource.addProperty(RDF.type, SKOS.Concept);
        skosConceptWithHomepageResource.addProperty(FOAF.homepage, SKOS.Concept);


        datRes.addProperty(predicate, skosConceptWithHomepageResource);

    }

    public DcatBuilder addPeriodResourceAnnon(Resource resource, Property property, PeriodOfTime period) {

        Resource temporal = model.createResource();
        model.add(temporal, RDF.type, DCTerms.PeriodOfTime);

        resource.addProperty(property,temporal);

        temporal.addProperty(time_hasBeginning, createTimeInstantResource(period.getStartDate()));
        temporal.addProperty(time_hasEnd, createTimeInstantResource(period.getEndDate()));

        return this;
    }

    public Resource createTimeInstantResource(Date date) {
        Resource timeInstant = model.createResource();
        model.add(timeInstant, RDF.type, TIME_INSTANT);

        Literal dateLiteral = model.createTypedLiteral(sdfDateTime.format(date), XSDDatatype.XSDdateTime);
        timeInstant.addProperty(time_inXSDDateTime, dateLiteral);

        return timeInstant;
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
                addProperty(disRes, DCTerms.license, distribution.getLicense());

                addProperties(disRes, DCAT.accessURL, distribution.getAccessURL());
                addLiterals(disRes, DCTerms.format, distribution.getFormat());
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
