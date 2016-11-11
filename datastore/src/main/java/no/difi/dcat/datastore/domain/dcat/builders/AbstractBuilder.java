package no.difi.dcat.datastore.domain.dcat.builders;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.bind.DatatypeConverter;

import org.apache.jena.rdf.model.*;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
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
	
	public static Contact extractContact(Resource resource) {
		try {
			Contact contact = new Contact();
			Statement property = resource.getProperty(DCAT.contactPoint);

			if (property == null ) {
				logger.warn("Missing property {} from resource {}", DCAT.contactPoint, resource.getURI());
				return null;
			}

			Resource object = resource.getModel().getResource(property.getObject().asResource().getURI());

			contact.setId(object.getURI());
			contact.setFullname(extractAsString(object, ResourceFactory.createProperty("http://www.w3.org/2006/vcard/ns#fn")));
			contact.setEmail(extractAsString(object, ResourceFactory.createProperty("http://www.w3.org/2006/vcard/ns#hasEmail")).replace("mailto:", ""));
			contact.setTelephone(extractAsString(object, ResourceFactory.createProperty("http://www.w3.org/2006/vcard/ns#hasTelephone")).replace("tel:",""));

			return contact;
		} catch (Exception e) {
			logger.warn("Error when extracting property {} from resource {}", DCAT.contactPoint, resource.getURI(), e);
		}

		return null;
	}

	/**
	 * Extract period of time property from DCAT resource and map to model class
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
			Resource object = resource.getModel().getResource(property.getObject().asResource().getURI());
			publisher.setId(object.getURI());
			publisher.setName(extractAsString(object, FOAF.name));
			
			return publisher;
		} catch (Exception e) {
			logger.warn("Error when extracting property {} from resource {}", DCTerms.publisher, resource.getURI(), e);
		}
		
		return null;
	}
}
