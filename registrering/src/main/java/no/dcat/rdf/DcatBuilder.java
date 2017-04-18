package no.dcat.rdf;

import no.dcat.model.Catalog;
import no.dcat.model.Contact;
import no.dcat.model.Dataset;
import no.dcat.model.Distribution;
import no.dcat.model.PeriodOfTime;
import no.dcat.model.Publisher;
import no.dcat.model.SkosCode;
import org.apache.jena.datatypes.xsd.XSDDatatype;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.RDF;
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

    public final static Model mod = ModelFactory.createDefaultModel();
    public final static String DCAT = "http://www.w3.org/ns/dcat#";
    public final static String DCT = "http://purl.org/dc/terms/";
    public final static String FOAF = "http://xmlns.com/foaf/0.1/";
    public final static String VCARD = "http://www.w3.org/2006/vcard/ns#";
    public final static String DCATNO = "http://difi.no/dcatno#";
    public final static String TIME = "http://www.w3.org/TR/owl-time/";
    public final static String ADMS = "http://www.w3.org/ns/adms#";
    public final static String XSD = "http://www.w3.org/2001/XMLSchema#";

    public final static Property adms_identifier = mod.createProperty(ADMS, "identifier");

    public final static Resource DCT_PERIODOFTIME = mod.createResource(DCT + "PeriodOfTime");

    public final static Property dct_identifier = mod.createProperty(DCT, "identifier");
    public final static Property dct_publisher = mod.createProperty(DCT, "publisher");
    public final static Property dct_issued = mod.createProperty(DCT, "issued");
    public final static Property dct_modified = mod.createProperty(DCT, "modified");
    public final static Property dct_language = mod.createProperty(DCT, "language");
    public final static Property dct_conformsTo = mod.createProperty(DCT, "conformsTo");
    public final static Property dct_temporal = mod.createProperty(DCT, "temporal");
    public final static Property dct_spatial = mod.createProperty(DCT, "spatial");
    public final static Property dct_rights = mod.createProperty(DCT, "rights");
    public final static Property dct_references = mod.createProperty(DCT, "references");
    public final static Property dct_provenance = mod.createProperty(DCT, "provenance");
    public final static Property dct_accrualPeriodicity = mod.createProperty(DCT, "accrualPeriodicity");
    public final static Property dct_subject = mod.createProperty(DCT, "subject");
    public final static Property dct_type = mod.createProperty(DCT, "type");


    public final static Resource TIME_INSTANT = mod.createResource(TIME + "Instant");
    public final static Property time_hasBeginning = mod.createProperty(TIME, "hasBeginning");
    public final static Property time_hasEnd = mod.createProperty(TIME, "hasEnd");
    public final static Property time_inXSDDateTime = mod.createProperty(TIME, "inXSDDateTime");

    public final static Resource DCAT_CATALOG = mod.createResource(DCAT + "Catalog");
    public final static Property dcat_title = mod.createProperty(DCT, "title");
    public final static Property dcat_description = mod.createProperty(DCT, "description");
    public final static Property dcat_dataset = mod.createProperty(DCAT, "dataset");

    public final static Resource DCAT_DATASET = mod.createResource(DCAT + "Dataset");
    public final static Property dcat_contactPoint = mod.createProperty(DCAT, "contactPoint");
    public final static Property dcat_distribution = mod.createProperty(DCAT, "distribution");
    public final static Property dcat_keyword = mod.createProperty(DCAT, "keyword");
    public final static Property dcat_landingPage = mod.createProperty(DCAT, "landingPage");
    public final static Property dcat_theme = mod.createProperty(DCAT, "theme");

    public final static Property dcatno_accessRightsComment = mod.createProperty(DCATNO, "accessRightsComment");

    public final static Resource DCAT_DISTRIBUTION = mod.createResource(DCAT + "Distribution");
    public final static Property dcat_accessUrl = mod.createProperty(DCAT, "accessUrl");
    public final static Property dcat_format = mod.createProperty(DCAT, "format");
    public final static Property dct_license = mod.createProperty(DCT, "license");

    public final static Resource FOAF_AGENT = mod.createResource(FOAF + "Agent");
    public final static Property foaf_name = mod.createProperty(FOAF, "name");
    public final static Property foaf_page = mod.createProperty(FOAF, "page");

    public final static Resource VCARD_ORG = mod.createResource(VCARD + "Organization");
    public final static Property vcard_hasEmail = mod.createProperty(VCARD, "hasEmail");
    public final static Property vcard_fullName = mod.createProperty(VCARD, "fn");
    public final static Property vcard_OrganizationName = mod.createProperty(VCARD, "organization-name");
    public final static Property vcard_organizationUnit = mod.createProperty(VCARD, "organization-unit");
    public final static Property vcard_hasUrl = mod.createProperty(VCARD, "hasUrl");
    public final static Property vcard_hasTelephone = mod.createProperty(VCARD, "hasTelephone");

    public static String catPrefix = "http://reg.brreg.no/catalogs/";

    private Model model;
    private Map<Object, Resource> resourceMap = new HashMap<>();

    public DcatBuilder() {
        model = ModelFactory.createDefaultModel();
        model.setNsPrefix("dct", DCT);
        model.setNsPrefix("dcat", DCAT);
        model.setNsPrefix("foaf", FOAF);
        model.setNsPrefix("vcard", VCARD);
        model.setNsPrefix("time", TIME);
        model.setNsPrefix("dcatno", DCATNO);
        model.setNsPrefix("xsd", XSD);
        model.setNsPrefix("adms", ADMS);
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
        Resource catRes = createResource(catalog, catalog.getUri(), DCAT_CATALOG);
        addLiterals(catRes, dcat_title, catalog.getTitle());
        addLiterals(catRes, dcat_description, catalog.getDescription());

        addPublisher(catRes, catalog.getPublisher());

        addDatasets(catRes, catalog.getDataset());

        return this;
    }

    public DcatBuilder addDatasets(Resource catRes, List<Dataset> datasets) {
        if (datasets != null) {
            for (Dataset dataset : datasets) {
                addProperty(catRes, dcat_dataset, dataset.getUri());

                Resource datRes = createResource(dataset, dataset.getUri(), DCAT_DATASET);

                addLiterals(datRes, dcat_title, dataset.getTitle());
                addLiterals(datRes, dcat_description, dataset.getDescription());

                addContactPoints(datRes, dataset.getContactPoint());

                if (dataset.getKeyword() != null)
                    for (Map<String, String> keyword : dataset.getKeyword()) {
                        addLiterals(datRes, dcat_keyword, keyword);
                    }

                addUriProperty(datRes, dct_publisher, dataset.getPublisher());

                addDateTimeLiteral(datRes, dct_issued, dataset.getIssued());
                addDateLiteral(datRes, dct_modified, dataset.getModified());
                addProperty(datRes, dct_language, dataset.getLanguage());
                addProperties(datRes, dcat_landingPage, dataset.getLandingPage());
                addUriProperties(datRes, dcat_theme, dataset.getTheme());

                addDistributions(datRes, dataset.getDistribution());

                addProperties(datRes, dct_conformsTo, dataset.getConformsTo());

                if (dataset.getTemporal() != null)
                    for (PeriodOfTime period : dataset.getTemporal()) {
                        addPeriodResourceAnnon(datRes, dct_temporal, period);
                    }

                addUriProperties(datRes, dct_spatial, dataset.getSpatial());
                addProperty(datRes, dct_rights, dataset.getAccessRights());
                addProperties(datRes, dcatno_accessRightsComment, dataset.getAccessRightsComment());
                addProperties(datRes, dct_references, dataset.getReferences());
                addProperty(datRes, dct_provenance, dataset.getProvenance());
                addStringLiterals(datRes, dct_identifier, dataset.getIdentifier());
                addProperties(datRes, foaf_page, dataset.getPage());
                addProperty(datRes, dct_accrualPeriodicity, dataset.getAccrualPeriodicity());
                addProperties(datRes, dct_subject, dataset.getSubject());
                addProperty(datRes, dct_type, dataset.getType());
                addProperties(datRes, adms_identifier, dataset.getAdmsIdentifier());

            }
        }

        return this;
    }

    public DcatBuilder addPeriodResourceAnnon(Resource resource, Property property, PeriodOfTime period) {

        Resource temporal = model.createResource();
        model.add(temporal, RDF.type, DCT_PERIODOFTIME);

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
            addProperty(resource, dct_publisher, publisher.getUri());

            Resource pubRes = createResource(publisher, publisher.getUri(), FOAF_AGENT);

            addLiteral(pubRes, foaf_name, publisher.getName());
            addLiteral(pubRes, dct_identifier, publisher.getId());
        }
        return this;
    }

    public DcatBuilder addDistributions(Resource dataset, List<Distribution> distributions) {
        if (distributions != null) {
            for (Distribution distribution : distributions) {
                addProperty(dataset, dcat_distribution, distribution.getUri());

                Resource disRes = createResource(distribution, distribution.getUri(), DCAT_DISTRIBUTION);

                addLiterals(disRes, dcat_title, distribution.getTitle());
                addLiterals(disRes, dcat_description, distribution.getDescription());
                addProperty(disRes, dct_license, distribution.getLicense());

                addProperties(disRes, dcat_accessUrl, distribution.getAccessURL());
                addLiterals(disRes, dcat_format, distribution.getFormat());
            }
        }

        return this;
    }

    public DcatBuilder addContactPoints(Resource datRes, List<Contact> contacts) {
        if (contacts != null) {
            for (Contact contact : contacts) {
                addProperty(datRes, dcat_contactPoint, contact.getUri());

                Resource contactRes = createResource(contact, contact.getUri(), VCARD_ORG);

                addLiteral(contactRes, vcard_fullName, contact.getFullname());
                addProperty(contactRes, vcard_hasUrl, contact.getHasURL());
                addLiteral(contactRes, vcard_OrganizationName, contact.getOrganizationName());
                addLiteral(contactRes, vcard_organizationUnit, contact.getOrganizationUnit());

                if (contact.getEmail() != null) {
                    if (!contact.getEmail().startsWith("mailto:")) {
                        addProperty(contactRes, vcard_hasEmail, "mailto:" + contact.getEmail());
                    } else {
                        addProperty(contactRes, vcard_hasEmail, contact.getEmail());
                    }
                }

                if (contact.getHasTelephone() != null) {
                    if (!contact.getHasTelephone().startsWith("tel:")) {
                        addProperty(contactRes, vcard_hasTelephone, "tel:" + contact.getHasTelephone());
                    } else {
                        addProperty(contactRes, vcard_hasTelephone, contact.getHasTelephone());
                    }
                }
            }
        }
        return this;
    }

    public Resource createResource(Object o, String uri, Resource resourceType) {
        Resource resource = model.createResource(uri);
        resourceMap.put(o, resource);
        model.add(resource, RDF.type, resourceType);

        return resource;
    }

    public DcatBuilder addProperty(Resource resource, Property property, SkosCode code) {
        if (code != null) {
            Resource r = model.createResource(code.getUri());
            resource.addProperty(property, r);
        }

        return this;
    }

    public DcatBuilder addProperties(Resource resource, Property property, List<String> uris) {
        if (uris != null) {
            for (String uri : uris) {
                addProperty(resource, dct_subject, uri);
            }

        }

        return this;
    }

    public DcatBuilder addUriProperty(Resource resource, Property property, Object objectWithUri){
        if (objectWithUri != null) {
            try {
                Method m = objectWithUri.getClass().getMethod("getUri");
                String uri = (String) m.invoke(objectWithUri);
                addProperty(resource, property, uri);
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
        if (uri != null) {
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
