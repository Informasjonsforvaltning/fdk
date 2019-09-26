package no.dcat.datastore.domain.dcat.builders;

import no.dcat.datastore.domain.dcat.Publisher;
import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.dcat.datastore.domain.dcat.vocabulary.DCATCrawler;
import no.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import no.dcat.datastore.domain.dcat.vocabulary.EnhetsregisteretRDF;
import no.dcat.datastore.domain.dcat.vocabulary.Vcard;
import no.dcat.shared.Contact;
import no.dcat.shared.PeriodOfTime;
import no.dcat.shared.Reference;
import no.dcat.shared.SkosCode;
import no.dcat.shared.SkosConcept;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.ResourceFactory;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.SKOS;
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

    public static final String CONTACT_PREFIX = "http://datakatalog.no/contact";
    public static final String CONTACT_PREFIX_FEIL = "http://dataktalog.no/contact";

    static Property owlTime_hasBeginning = ResourceFactory.createProperty("http://www.w3.org/TR/owl-time/hasBeginning");
    static Property owlTime_hasEnd = ResourceFactory.createProperty("http://www.w3.org/TR/owl-time/hasEnd");
    static Property schema_startDate = ResourceFactory.createProperty("http://schema.org/startDate");
    static Property schema_endDate = ResourceFactory.createProperty("http://schema.org/endDate");

    public static String defaultLanguage = "no";

    private static Logger logger = LoggerFactory.getLogger(AbstractBuilder.class);
    static Map<String, Contact> contactMap = new HashMap<>();


    // TODO - remove in next iteration
    public static boolean hasGeneratedContactPrefix(Contact contact) {
        return (contact.getUri() != null && (contact.getUri().startsWith(CONTACT_PREFIX) || contact.getUri().startsWith(CONTACT_PREFIX_FEIL)));
    }

    public static List<String> extractMultipleStrings(Resource resource, Property property) {
        List<String> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            result.add(statement.getObject().toString());
        }
        if (result.size() > 0) {
            return result;
        }
        return null;
    }

    public static List<String> extractMultipleStringsExcludeBaseUri(Resource resource, Property property) {
        List<String> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            String valueAsResource = statement.getObject().toString();

            result.add(removeDefaultBaseUri(resource.getModel(), valueAsResource));
        }
        if (result.size() > 0) {
            return result;
        }
        return null;
    }

    public static List<String> extractUriList(Resource resource, Property property) {
        List<String> result = new ArrayList<>();

        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();

            String uri = statement.getObject().asResource().toString();
            String strippedUri = removeDefaultBaseUri(resource.getModel(), uri);

            if (strippedUri.matches("^(http|https|file|ftp)://.*$")) {
                result.add(strippedUri);
            } else {
                result.add("http://" + strippedUri);
            }
        }

        return result;
    }

    public static String extractUri(Resource resource, Property property) {
        String valueToStrip = extractAsString(resource, property);
        if (valueToStrip != null) {
            String uri = removeDefaultBaseUri(resource.getModel(), valueToStrip);

            if (uri.startsWith("http://")) {
                return uri;
            } else {
                return "http://" + uri;
            }
        }

        return null;
    }

    public static String removeDefaultBaseUri(Model model, String valueToStrip) {
        if (model != null && valueToStrip != null) {
            Resource importInformation = model.getResource(DCATCrawler.ImportResource.getURI());
            if (importInformation != null) {
                Statement sourceStatement = importInformation.getProperty(DCATCrawler.source_url);
                if (sourceStatement != null) {
                    String baseImportUri = sourceStatement.getObject().asResource().getNameSpace();
                    if (baseImportUri == null) {
                        return valueToStrip;
                    }

                    String valueToStripString = valueToStrip.replaceFirst("(file|http|ftp|https):\\/+", "");
                    baseImportUri = baseImportUri.replaceFirst("(file|ftp|http|https):\\/+", "");

                    if (valueToStripString.startsWith(baseImportUri)) {
                        return valueToStripString.replace(baseImportUri, "");
                    } else {
                        return valueToStrip;
                    }
                }
            }
        }

        return valueToStrip;
    }

    public static String extractAsString(Resource resource, Property property) {
        try {
            Statement statement = resource.getProperty(property);
            String x = getStringFromStatement(statement);
            if (x != null) return x;
        } catch (Exception e) {
            logger.warn("Error when extracting property {} from resource {}. Reason {}", property, resource.getURI(), e.getLocalizedMessage());
        }
        return null;
    }

    public static boolean extractAsBoolean(Resource resource, Property property) {
        try {
            Statement statement = resource.getProperty(property);
            if (statement != null) {
                boolean result = statement.getObject().asLiteral().getBoolean();

                return result;
            }
        } catch (Exception e) {
            logger.warn("Error when extracting boolean {} from resource {}. Reason {}", property, resource.getURI(), e.getLocalizedMessage());

        }

        return false;
    }


    private static String getStringFromStatement(Statement statement) {
        if (statement != null) {
            if (statement.getObject().isLiteral()) {
                return statement.getString();
            } else {
                if (statement.getObject().isResource()) {
                    String x = statement.getObject().asResource().getURI();
                    return removeDefaultBaseUri(statement.getModel(), x);
                } else {
                    return statement.getObject().asLiteral().getValue().toString();
                }

            }
        }
        return null;
    }

    public static List<SkosConcept> extractSkosConcept(Resource resource, Property property) {
        List<SkosConcept> result = new ArrayList<>();
        StmtIterator iterator = resource.listProperties(property);

        while (iterator.hasNext()) {
            Statement statement = iterator.next();

            Resource skosConcept = null;
            if (statement.getObject().isResource()) {
                skosConcept = statement.getObject().asResource();
            }
            if (skosConcept != null) {
                String type = null;

                StmtIterator stmtIterator = skosConcept.listProperties(RDF.type);
                while (stmtIterator.hasNext()) {
                    Statement typeStmnt = stmtIterator.next();
                    if (typeStmnt != null && !typeStmnt.getObject().toString().equals(SKOS.Concept.getURI())) {
                        type = typeStmnt.getObject().toString();
                    }
                }

                Map<String, String> prefLabel = extractLanguageLiteral(skosConcept, SKOS.prefLabel);

                // check and remove empty prefLabel
                if (prefLabel != null && prefLabel.size() == 0) {
                    prefLabel = null;
                }

                String source = null;
                if (skosConcept.getProperty(DCTerms.source) != null) {
                    source = skosConcept.getProperty(DCTerms.source).getObject().toString();
                }
                if (source != null) {
                    SkosConcept concept = SkosConcept.getInstance(source, prefLabel);
                    concept.setExtraType(type);
                    result.add(concept);
                } else {
                    //New case, we find a skosConcept, but it only contains the licence as an URI
                    String theActualLicenceURI = skosConcept.getURI();
                    result.add(SkosConcept.getInstance(theActualLicenceURI));
                }
            } else {
                if (statement.getObject().toString() != null && !statement.getObject().toString().isEmpty()) {
                    result.add(SkosConcept.getInstance(statement.getObject().toString()));
                }
            }
        }

        if (result.size() > 0) {
            return result;
        }

        return null;
    }


    public static List<Reference> extractReferences(Resource resource, Map<String, SkosCode> referenceTypes) {
        List<Reference> result = new ArrayList<>();

        Property[] propertyList = {
                DCTerms.hasVersion, DCTerms.isVersionOf,
                DCTerms.isPartOf, DCTerms.hasPart,
                DCTerms.references, DCTerms.isReferencedBy,
                DCTerms.replaces, DCTerms.isReplacedBy,
                DCTerms.requires, DCTerms.isRequiredBy,
                DCTerms.relation, DCTerms.source
        };

        for (Property property : propertyList) {
            StmtIterator iterator = resource.listProperties(property);
            while (iterator.hasNext()) {
                Statement statement = iterator.next();

                SkosConcept source = new SkosConcept();

                source.setUri(extractAsString(statement.getResource(), DCTerms.source));
                if (source.getUri() == null) {
                    source.setUri(statement.getObject().toString());
                } else {
                    source.setExtraType(extractAsString(statement.getResource(), DCAT.Dataset));
                    source.setPrefLabel(extractLanguageLiteral(statement.getObject().asResource(), SKOS.prefLabel));
                }
                SkosCode code = null;
                if (referenceTypes != null) {
                    code = referenceTypes.get(property.getURI());
                }
                if (code == null) {
                    code = new SkosCode();
                    code.setUri(property.getURI());
                }

                Reference referenceElement = new Reference(code, source);
                result.add(referenceElement);
            }
        }
        if (result.size() > 0) {
            return result;
        }

        return null;
    }


    public static Map<String, String> extractLanguageLiteral(Resource resource, Property property) {
        Map<String, String> map = new HashMap<>();
        StmtIterator iterator = resource.listProperties(property);
        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            String language = statement.getLanguage();
            if (language == null || language.isEmpty()) {
                language = defaultLanguage;
            }
            if (statement.getString() != null && !statement.getString().isEmpty()) {
                map.put(language, statement.getString());
            }
        }

        if (map.keySet().size() > 0) {
            return map;
        }

        return null;
    }

    public static List<Map<String, String>> extractMultipleLanguageLiterals(Resource resource, Property property) {
        Map<String, List<String>> map = new HashMap<>();
        StmtIterator iterator = resource.listProperties(property);

        while (iterator.hasNext()) {
            Statement statement = iterator.next();
            String language = statement.getLanguage();
            if (language == null || language.isEmpty()) {
                language = defaultLanguage;
            }
            if (statement.getString() != null && !statement.getString().isEmpty()) {
                List<String> x = map.get(language);
                if (x == null) {
                    x = new ArrayList<>();
                    map.put(language, x);
                }
                x.add(statement.getString());
            }
        }

        if (map.keySet().size() > 0) {
            List<Map<String, String>> result = new ArrayList<>();

            for (String language : map.keySet()) {
                for (String value : map.get(language)) {
                    Map<String, String> x = new HashMap<>();
                    x.put(language, value);
                    result.add(x);
                }
            }
            return result;
        }

        return null;
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

        if (result.size() > 0) {
            return result;
        }

        return null;
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
                logger.warn("Error when extracting property {} from resource {}. Reason: {}", property, resource.getURI(), e.getMessage());
            }
        }
        return null;
    }


    /**
     * Extracts contactInformation objects from RDF as a vcard:Kind/Organization.
     * <p>
     * If no contacts is found. It only creates contacts if it has attributes.
     *
     * @param datasetResource the resource which contains the contact point resource
     * @return a list of instantiated Contact object.
     */
    public static List<Contact> extractContacts(Resource datasetResource) {
        try {
            List<Contact> result = new ArrayList<>();
            StmtIterator iterator = datasetResource.listProperties(DCAT.contactPoint);
            while (iterator.hasNext()) {
                Contact contact = new Contact();
                boolean hasAttributes = false;

                final Statement property = iterator.next();

                if (property == null) {
                    logger.warn("Missing property {} from resource {}", DCAT.contactPoint, datasetResource.getURI());
                    continue;
                }

                final Resource object = property.getObject().asResource();

                if (object.getURI() != null && !object.getURI().isEmpty()) {
                    contact.setUri(object.getURI());

                    // reuse existing contact
                    if (contactMap.containsKey(contact.getUri())) {
                        result.add(contactMap.get(contact.getUri()));
                        continue;
                    }

                    contactMap.put(contact.getUri(), contact);
                }

                final String fn = extractAsString(object, Vcard.fn);
                if (fn != null) {
                    hasAttributes = true;
                    contact.setFullname(fn);
                }

                final String email = extractAsString(object, Vcard.hasEmail);
                if (email != null) {
                    hasAttributes = true;
                    if (email.startsWith("mailto:")) {
                        contact.setEmail(email.substring("mailto:".length(), email.length()));
                    } else {
                        contact.setEmail(email);
                    }
                }

                final String telephone = extractAsString(object, Vcard.hasTelephone);
                if (telephone != null) {
                    hasAttributes = true;
                    if (telephone.startsWith("tel:")) {
                        contact.setHasTelephone(telephone.substring("tel:".length(), telephone.length()));
                    } else {
                        contact.setHasTelephone(telephone);
                    }
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
                    contactMap.put(contact.getUri(), contact);
                    result.add(contact);
                }
            }

            return result;

        } catch (Exception e) {
            logger.warn("Error when extracting property {} from resource {}. Reason {}",
                    DCAT.contactPoint, datasetResource.getURI(), e.getLocalizedMessage());
        }

        return null;
    }


    /**
     * Extract period of time property from DCAT resource and map to model class.
     *
     * @param datasetResource DCAT RDF resource
     * @return List of period of time objects
     * TODO: implement extraction of time period name
     */
    public static List<PeriodOfTime> extractPeriodOfTime(Resource datasetResource) {

        List<PeriodOfTime> result = new ArrayList<>();

        try {
            //Denne virker av en eller annen grunn ikke. Må i stedet iterere gjennom alle statemts og sjekke predikat
            //StmtIterator iterator = resource.listProperties(DCTerms.temporal);

            StmtIterator iterator = datasetResource.listProperties();
            while (iterator.hasNext()) {
                Statement stmt = iterator.next();
                if (stmt.getPredicate().equals(DCTerms.temporal)) {

                    PeriodOfTime period = new PeriodOfTime();
                    Resource timePeriodRes = stmt.getObject().asResource();

                    StmtIterator timePeriodStmts = timePeriodRes.listProperties();
                    while (timePeriodStmts.hasNext()) {
                        Statement tpStmt = timePeriodStmts.next();
                        // the norheim way
                        if (tpStmt.getPredicate().equals(owlTime_hasBeginning)) {
                            Resource hasBeginningRes = tpStmt.getObject().asResource();
                            StmtIterator begIt = hasBeginningRes.listProperties();
                            period.setStartDate(extractDate(hasBeginningRes, ResourceFactory.createProperty("http://www.w3.org/TR/owl-time/inXSDDateTime")));

                        }
                        if (tpStmt.getPredicate().equals(owlTime_hasEnd)) {
                            Resource hasEndRes = tpStmt.getObject().asResource();
                            StmtIterator endIt = hasEndRes.listProperties();
                            period.setEndDate(extractDate(hasEndRes, ResourceFactory.createProperty("http://www.w3.org/TR/owl-time/inXSDDateTime")));
                        }
                        // the standard way dcat-ap-no
                        if (tpStmt.getPredicate().equals(schema_startDate)) {
                            period.setStartDate(extractDate(timePeriodRes, schema_startDate));
                        }
                        if (tpStmt.getPredicate().equals(schema_endDate)) {
                            period.setEndDate(extractDate(timePeriodRes, schema_endDate));
                        }
                    }
                    logger.debug("   POT: Periode identifisert: start: " + period.getStartDate() + " end: " + period.getEndDate());
                    result.add(period);
                }
            }
        } catch (Exception e) {
            logger.warn("Error when extracting property {} from resource {}. Reason {}", DCTerms.temporal, datasetResource.getURI(), e.getLocalizedMessage());
        }
        if (result.size() > 0) {
            return result;
        }

        return null;
    }


    public static Publisher extractPublisher(Resource resource, Property property) {
        try {
            Publisher publisher = new Publisher();
            Statement propertyStmnt = resource.getProperty(property);
            if (propertyStmnt != null) {
                Resource object = resource.getModel().getResource(propertyStmnt.getObject().asResource().getURI());
                extractPublisherFromStmt(publisher, object);

                return publisher;
            }
        } catch (Exception e) {
            logger.warn("Error when extracting property {} from resource {}", DCTerms.publisher, resource.getURI(), e);
        }

        return null;
    }

    protected static void extractPublisherFromStmt(Publisher publisher, Resource object) {
        publisher.setUri(object.getURI());
        publisher.setId(extractAsString(object, DCTerms.identifier));

        String name = extractAsString(object, FOAF.name);
        if (name != null) {
            publisher.setName(name);
        }

        Map<String, String> preferredName = extractLanguageLiteral(object, SKOS.prefLabel);
        if (preferredName != null && preferredName.size() > 0) {
            publisher.setPrefLabel(preferredName);
        }

        publisher.setValid(extractAsBoolean(object, DCTerms.valid));
        publisher.setOrgPath(extractAsString(object, DCATNO.organizationPath));

        publisher.setOrganisasjonsform(extractAsString(object, EnhetsregisteretRDF.organisasjonsform));
        publisher.setOverordnetEnhet(extractAsString(object, EnhetsregisteretRDF.overordnetEnhet));

        Statement hasProperty = object.getProperty(EnhetsregisteretRDF.naeringskode);
        if (hasProperty != null) {
            publisher.setNaeringskode(extractBRCode(hasProperty, "http://www.ssb.no/nace/sn2007/"));
        }

        hasProperty = object.getProperty(EnhetsregisteretRDF.institusjonellSektorkode);
        if (hasProperty != null) {
            publisher.setSektorkode(extractBRCode(hasProperty, "http://www.brreg.no/sektorkode/"));
        }
    }

    private static SkosCode extractBRCode(Statement hasProperty, String codeUri) {

        Resource codeResource = hasProperty.getResource().asResource();
        SkosCode skosCode = new SkosCode();
        String beskrivelse = extractAsString(codeResource, EnhetsregisteretRDF.beskrivelse);
        String kode = extractAsString(codeResource, EnhetsregisteretRDF.kode);
        skosCode.setUri(codeUri + kode);
        skosCode.setCode(kode);
        Map<String, String> languageString = new HashMap<>();
        languageString.put(defaultLanguage, beskrivelse);
        skosCode.setPrefLabel(languageString);

        return skosCode;
    }

    protected static SkosCode getCode(Map<String, SkosCode> codes, String locUri) {
        if (codes == null) {
            return null;
        }

        if (locUri == null || locUri.trim().equals("")) {
            return null;
        }

        SkosCode result = codes.get(locUri);

        if (result == null) {
            logger.warn("Code with uri [{}] does not exist and will be removed.", locUri);

        }

        return result;
    }

    protected static List<SkosCode> getCodes(Model model, Map<String, SkosCode> locations, List<String> locsUri) {
        List<SkosCode> result = new ArrayList<>();

        if (locations == null) {
            logger.warn("Abort getCodes since no list of approved codes is present");
            return null;
        }

        if (locsUri != null) {
            for (String locUri : locsUri) {
                if (locUri == null || locUri.trim().equals("")) {
                    continue;
                }
                locUri = removeDefaultBaseUri(model, locUri);

                SkosCode locCode = locations.get(locUri);

                if (locCode == null) {
                    //Issue 2264 (https://github.com/Informasjonsforvaltning/fdk/issues/2264) : Data norge returns https ids for http location links.
                    locUri = locUri.replaceAll("http","https");
                    locCode = locations.get(locUri);
                    if (locCode != null) {
                        result.add(locCode);
                    } else {
                        logger.warn("Code with uri [{}] does not exist in approved codelist and is removed from dataset.", locUri);
                    }
                    continue;
                }
                result.add(locCode);
            }
        }

        if (result.size() > 0) {
            return result;
        }

        return null;
    }


}
