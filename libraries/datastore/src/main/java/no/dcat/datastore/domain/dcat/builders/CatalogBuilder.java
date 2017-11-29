package no.dcat.datastore.domain.dcat.builders;

import no.dcat.shared.Catalog;
import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.DCTerms;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class CatalogBuilder extends AbstractBuilder {
	
	public static Catalog create(Resource catalog) {
		Catalog created = new Catalog();
		
		if (catalog != null) {
			created.setUri(catalog.getURI());
			String uri = catalog.getURI();
			Pattern p = Pattern.compile("(\\d{9})");
			Matcher m = p.matcher(uri);
			String orgnr = null;
			if (m.find()) {
				orgnr = m.group(1);
			}
			if (orgnr != null) {
				created.setId(orgnr);
			}
			created.setTitle(extractLanguageLiteral(catalog, DCTerms.title));
			created.setDescription(extractLanguageLiteral(catalog, DCTerms.description));
			created.setIssued(extractDate(catalog, DCTerms.issued));
			created.setModified(extractDate(catalog, DCTerms.modified));
			created.setLanguage(extractAsString(catalog, DCTerms.language));
			created.setPublisher(extractPublisher(catalog, DCTerms.publisher));
			created.setThemeTaxonomy(extractMultipleStrings(catalog, DCAT.themeTaxonomy ));
		}
		
		return created;
	}

}
