package no.difi.dcat.datastore.domain.dcat.builders;

import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.DCTerms;

import no.difi.dcat.datastore.domain.dcat.Catalog;

public class CatalogBuilder extends AbstractBuilder {
	
	public static Catalog create(Resource catalog) {
		Catalog created = new Catalog();
		
		if (catalog != null) {
			created.setId(catalog.getURI());
			created.setTitle(extractLanguageLiteral(catalog, DCTerms.title));
			created.setDescription(extractLanguageLiteral(catalog, DCTerms.description));
			created.setIssued(extractDate(catalog, DCTerms.issued));
			created.setModified(extractDate(catalog, DCTerms.modified));
			created.setLanguage(extractAsString(catalog, DCTerms.language));
			created.setPublisher(extractPublisher(catalog));
			created.setThemeTaxonomy(extractTheme(catalog, DCAT.themeTaxonomy ));
		}
		
		return created;
	}

}
