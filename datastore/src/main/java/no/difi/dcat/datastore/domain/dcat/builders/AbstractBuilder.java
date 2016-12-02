package no.difi.dcat.datastore.domain.dcat.builders;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.bind.DatatypeConverter;

import no.difi.dcat.datastore.domain.dcat.vocabulary.Vcard;
import org.apache.jena.rdf.model.*;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import no.difi.dcat.datastore.domain.dcat.Contact;
import no.difi.dcat.datastore.domain.dcat.PeriodOfTime;
import no.difi.dcat.datastore.domain.dcat.Publisher;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;

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
		Map<String,String> map = new HashMap<>();
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

	public static Map<String, List<String>> extractMultipleLanguageLiterals(Resource resource, Property property) {
		Map<String, List<String>> map = new HashMap<>();
		StmtIterator iterator = resource.listProperties(property);
		while (iterator.hasNext()) {
			Statement statement = iterator.next();
			String key = statement.getLanguage();
			String value = statement.getString();
			if (!map.containsKey(key)) {
				map.put(key, new ArrayList<>());
			}
			map.get(key).add(value);
		}
		return map;
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

			if (property == null ) {
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
				contact.setEmail(email.replace("mailto:", ""));
			}

			final String telephone = extractAsString(object, Vcard.hasTelephone);
			if (telephone != null) {
				hasAttributes = true;
				contact.setTelephone(telephone.replace("tel:", ""));
			}

			final String organisationName = extractAsString(object, Vcard.organizationName);
			if (organisationName != null) {
				hasAttributes = true;
				contact.setOrganizationName(organisationName);
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
				if(stmt.getPredicate().equals(DCTerms.temporal)) {

					PeriodOfTime period = new PeriodOfTime();
					Resource timePeriodRes = stmt.getObject().asResource();

					StmtIterator timePeriodStmts = timePeriodRes.listProperties();
					while(timePeriodStmts.hasNext()) {
						Statement tpStmt = timePeriodStmts.next();
						if(tpStmt.getPredicate().equals(ResourceFactory.createProperty("http://www.w3.org/TR/owl-time/hasBeginning"))) {
							Resource hasBeginningRes = tpStmt.getObject().asResource();
							StmtIterator begIt = hasBeginningRes.listProperties();
							period.setStartDate(extractDate(hasBeginningRes, ResourceFactory.createProperty("http://www.w3.org/TR/owl-time/inXSDDateTime")));

						}
						if(tpStmt.getPredicate().equals(ResourceFactory.createProperty("http://www.w3.org/TR/owl-time/hasEnd"))) {
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
				publisher.setId(object.getURI());
				publisher.setName(extractAsString(object, FOAF.name));

				return publisher;
			}
		} catch (Exception e) {
			logger.warn("Error when extracting property {} from resource {}", DCTerms.publisher, resource.getURI(), e);
		}
		
		return null;
	}
}
