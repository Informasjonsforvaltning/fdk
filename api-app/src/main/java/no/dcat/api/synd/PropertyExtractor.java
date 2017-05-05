package no.dcat.api.synd;

import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.rdf.model.StmtIterator;
import org.apache.jena.shared.JenaException;

public class PropertyExtractor {

	public static final String DCAT_NAMESPACE = "http://www.w3.org/ns/dcat#";
	
	public static String extractExactlyOneStringOrNull(Resource resource, Property... p) {
		for (int i = 0; i < p.length; i++) {
			StmtIterator stmtIterator = resource.listProperties(p[i]);
			if (i == p.length - 1) {
				if (stmtIterator.hasNext()) {
					Statement next = stmtIterator.next();
					try {
						return next.getString();
					} catch (JenaException e) {
						return next.getObject().asResource().getURI();
					}
				}
			} else {
				if (stmtIterator.hasNext()) {
					try {
						resource = stmtIterator.next().getResource();
					} catch (JenaException e) {
						return null;
					}
				}
			}
		}
		return null;
	}
}
