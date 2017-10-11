package no.difi.dcat.datastore.domain.dcat.builders;

import no.dcat.shared.Contact;
import no.dcat.shared.Dataset;
import no.dcat.shared.PeriodOfTime;
import no.dcat.shared.Reference;
import no.dcat.shared.SkosCode;
import no.dcat.shared.SkosConcept;
import no.dcat.shared.Subject;
import no.difi.dcat.datastore.domain.dcat.Publisher;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.difi.dcat.datastore.domain.dcat.vocabulary.EnhetsregisteretRDF;
import no.difi.dcat.datastore.domain.dcat.vocabulary.Vcard;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.ResourceFactory;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.xml.bind.DatatypeConverter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class AbstractBuilder {

    private static Logger logger = LoggerFactory.getLogger(AbstractBuilder.class);

    public static String extractAsString(Resource resource, Property property) {
        try {
            Statement statement = resource.getProperty(property);
            if (statement != null) {
                if (statement.getObject().isLiteral()) {
                    return statement.getString();
                } else {
                    return statement.getObject().asResource().getURI();
                }
            }
        } catch (Exception e) {
            logger.warn("Error when extracting property {} from resource {}", property, resource.getURI(), e);
        }
        return null;
    }

    public static List<SkosConcept> extractSkosConcept(Resource resource, Property property) {
        //TODO
        List<SkosConcept> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();

            result.add(SkosConcept.getInstance(statement.getObject().toString(), ""));
        }
        return result;
    }

    // TODO
    public static List<Subject> extractSubjects(Resource resource, Property property) {
        List<Subject> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();

            Subject subject = new Subject();
            subject.setUri(statement.getObject().toString());

            result.add(subject);
        }

        return result;
    }

    // TODO
    public static List<Reference> extractReferences(Resource resource, Property property) {
        List<Reference> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();

            Dataset source = new Dataset();
            source.setUri(statement.getObject().toString());
            SkosCode code = new SkosCode();
            Map<String, String> label = new HashMap<>();
            label.put("nb", "reference");
            code.setPrefLabel(label);
            Reference reference = new Reference(code, source);
            result.add(reference);
        }

        return result;
    }

    public static List<String> extractMultipleStrings(Resource resource, Property property) {
        List<String> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            result.add(statement.getObject().toString());
        }
        return result;
    }


    public static Map<String, String> extractLanguageLiteral(Resource resource, Property property) {
        Map<String, String> map = new HashMap<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            map.put(statement.getLanguage(), statement.getString());
        }
        return map;
    }

    public static List<String> extractTheme(Resource resource, Property property) {
        List<String> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            result.add(statement.getObject().toString());
        }
        return result;
    }

    // input: dcat:keyword "beate"@nb, "poteter"@nb, "potatoes"@en, "tomater"@nn
    //
    public static List<Map<String, String>> extractKeywords(Resource resource, Property property) {
        List<Map<String, String>> result = new ArrayList<>();

        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            String key = statement.getLanguage();
            String value = statement.getString();
            Map<String, String> map = new HashMap<>();

            map.put(key, value);
            result.add(map);
        }

        return result;
    }

    public static Date extractDate(Resource resource, Property property) {
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            Calendar cal = null;
            try {
                cal = DatatypeConverter.parseDate(statement.getString());
                return cal.getTime();
            } catch (Exception e) {
                logger.warn("Error when extracting property {} from resource {}", property, resource.getURI(), e);
            }
        }
        return null;
    }

    /**
     * Extracts contactInformation from RDF as a vcard:Kind. If no attributes are found it returns null.
     *
     * @param resource the resource which contains the contact point resource
     * @return a instantiated Contact object.
     */
    public static Contact extractContact(Resource resource) {
        try {
            Contact contact = new Contact();
            boolean hasAttributes = false;

            final Statement property = resource.getProperty(DCAT.contactPoint);

            if (property == null) {
                logger.warn("Missing property {} from resource {}", DCAT.contactPoint, resource.getURI());
                return null;
            }

            final Resource object = resource.getModel().getResource(property.getObject().asResource().getURI());

            contact.setId(object.getURI());
            final String fn = extractAsString(object, Vcard.fn);
            if (fn != null) {
                hasAttributes = true;
                contact.setFullname(fn);
            }

            final String email = extractAsString(object, Vcard.hasEmail);
            if (email != null) {
                hasAttributes = true;
                contact.setEmail(email); //.replace("mailto:", ""));
            }

            final String telephone = extractAsString(object, Vcard.hasTelephone);
            if (telephone != null) {
                hasAttributes = true;
                contact.setHasTelephone(telephone); //.replace("tel:", ""));
            }

            final String organizationName = extractAsString(object, Vcard.organizationName);
            if (organizationName != null) {
                hasAttributes = true;
                contact.setOrganizationName(organizationName);
            }

            final String organizationUnit = extractAsString(object, Vcard.organizationUnit);
            if (organizationUnit != null) {
                hasAttributes = true;
                contact.setOrganizationUnit(organizationUnit);
            }

            final String hasURL = extractAsString(object, Vcard.hasURL);
            if (hasURL != null) {
                hasAttributes = true;
                contact.setHasURL(hasURL);
            }

            if (hasAttributes) {
                return contact;
            } else {
                return null;
            }
        } catch (Exception e) {
            logger.warn("Error when extracting property {} from resource {}", DCAT.contactPoint, resource.getURI(), e);
        }

        return null;
    }

    /**
     * Extract period of time property from DCAT resource and map to model class.
     *
     * @param resource DCAT RDF resource
     * @return List of period of time objects
     * TODO: implement extraction of time period name
     */
    public static List<PeriodOfTime> extractPeriodOfTime(Resource resource) {

        List<PeriodOfTime> result = new ArrayList<>();

        try {
            //Denne virker av en eller annen grunn ikke. Må i stedet iterere gjennom alle statemts og sjekke predikat
            //StmtIterator iterator = resource.listProperties(DCTerms.temporal);

            StmtIterator iterator = resource.listProperties();
            while (iterator.hasNext()) {
                Statement stmt = iterator.next();
                if (stmt.getPredicate().equals(DCTerms.temporal)) {

                    PeriodOfTime period = new PeriodOfTime();
                    Resource timePeriodRes = stmt.getObject().asResource();

                    StmtIterator timePeriodStmts = timePeriodRes.listProperties();
                    while (timePeriodStmts.hasNext()) {
                        Statement tpStmt = timePeriodStmts.next();
                        if (tpStmt.getPredicate().equals(ResourceFactory.createProperty("http://www.w3.org/TR/owl-time/hasBeginning"))) {
                            Resource hasBeginningRes = tpStmt.getObject().asResource();
                            StmtIterator begIt = hasBeginningRes.listProperties();
                            period.setStartDate(extractDate(hasBeginningRes, ResourceFactory.createProperty("http://www.w3.org/TR/owl-time/inXSDDateTime")));

                        }
                        if (tpStmt.getPredicate().equals(ResourceFactory.createProperty("http://www.w3.org/TR/owl-time/hasEnd"))) {
                            Resource hasEndRes = tpStmt.getObject().asResource();
                            StmtIterator endIt = hasEndRes.listProperties();
                            period.setEndDate(extractDate(hasEndRes, ResourceFactory.createProperty("http://www.w3.org/TR/owl-time/inXSDDateTime")));
                        }
                    }
                    logger.debug("   POT: Periode identifisert: start: " + period.getStartDate() + " end: " + period.getEndDate());
                    result.add(period);
                }
            }
        } catch (Exception e) {
            logger.warn("Error when extracting property {} from resource {}", DCTerms.temporal, resource.getURI(), e);
        }
        return result;
    }


    public static Publisher extractPublisher(Resource resource) {
        try {
            Publisher publisher = new Publisher();
            Statement property = resource.getProperty(DCTerms.publisher);
            if (property != null) {
                Resource object = resource.getModel().getResource(property.getObject().asResource().getURI());
                extractPublisherFromStmt(publisher, object);

                return publisher;
            }
        } catch (Exception e) {
            logger.warn("Error when extracting property {} from resource {}", DCTerms.publisher, resource.getURI(), e);
        }

        return null;
    }

    protected static void extractPublisherFromStmt(Publisher publisher, Resource object) {
        publisher.setId(object.getURI());
        publisher.setName(extractAsString(object, FOAF.name));

        Statement hasProperty = object.getProperty(EnhetsregisteretRDF.organisasjonsform);
        if (hasProperty != null) {
            publisher.setOrganisasjonsform(extractAsString(object, EnhetsregisteretRDF.organisasjonsform));
        }

        hasProperty = object.getProperty(EnhetsregisteretRDF.overordnetEnhet);
        if (hasProperty != null) {
            publisher.setOverordnetEnhet(extractAsString(object, EnhetsregisteretRDF.overordnetEnhet));
        }
    }

    protected static SkosCode getCode(Map<String, SkosCode> codes, String locUri) {
        if (locUri == null || locUri.trim().equals("")) {
            return null;
        }

        SkosCode result = codes.get(locUri);

        if (result == null) {
            logger.warn("Location with uri {} does not exist.", locUri);
        }

        return result;
    }

    protected static List<SkosCode> getCodes(Map<String, SkosCode> locations, List<String> locsUri) {
        List<SkosCode> result = new ArrayList();

        for (String locUri : locsUri) {
            if (locUri == null || locUri.trim().equals("")) {
                continue;
            }
            SkosCode locCode = locations.get(locUri);

            if (locCode == null) {
                logger.info("Location with uri {} does not exist.", locsUri);
                continue;
            }

            result.add(locCode);
        }
        return result;
    }

    protected static Map<String, String> getTitlesOfCode(Map<String, Map<String, SkosCode>> allCodes, String type, String codeKey) {

        Map<String, SkosCode> codesOfType = allCodes.get(type);

        if (codesOfType == null) {
            logger.info("Codes of type {} does not exist.", type);
            return null;
        }

        SkosCode code = codesOfType.get(codeKey);
        if (code == null) {
            logger.info("Codes of type {} and key {} does not exist.", type, codeKey);
            return null;
        }

        return code.getPrefLabel();
    }
}
