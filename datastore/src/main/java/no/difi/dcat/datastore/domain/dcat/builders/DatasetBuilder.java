package no.difi.dcat.datastore.domain.dcat.builders;

import java.util.ArrayList;
import java.util.List;

import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;

import no.difi.dcat.datastore.domain.dcat.Dataset;
import no.difi.dcat.datastore.domain.dcat.Distribution;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;

public class DatasetBuilder extends AbstractBuilder {

	private final Model model;
	
	public DatasetBuilder(Model model) {
		this.model = model;
	}
	
	public List<Dataset> build() {
		
		List<Dataset> datasets = new ArrayList<>();
		
		ResIterator catalogIterator = model.listResourcesWithProperty(RDF.type, DCAT.Catalog);
		while (catalogIterator.hasNext()) {
			Resource catalog = catalogIterator.next();
            StmtIterator datasetIterator = catalog.listProperties(DCAT.dataset);


			while (datasetIterator.hasNext()) {
				Resource dataset = datasetIterator.next().getResource();
				Dataset datasetObj = create(dataset, catalog);
				StmtIterator distributionIterator = dataset.listProperties(DCAT.distribution);
				List<Distribution> distributions = new ArrayList<>();
				while (distributionIterator.hasNext()) {
					Statement next = distributionIterator.nextStatement();


					if (next.getObject().isResource()) {
						Resource distribution = next.getResource();
						distributions.add(DistributionBuilder.create(distribution, null, null));
					}

				}
				datasetObj.setDistributions(distributions);
				datasets.add(datasetObj);
			}
		}
		
		return datasets;
	}
	
	public static Dataset create(Resource dataset, Resource catalog) {
		Dataset created = new Dataset();
		
		if (dataset != null) {
			created.setId(dataset.getURI());
			created.setTitle(extractLanguageLiteral(dataset, DCTerms.title));
			created.setDescription(extractLanguageLiteral(dataset, DCTerms.description));
			created.setIssued(extractDate(dataset, DCTerms.issued));
			created.setModified(extractDate(dataset, DCTerms.modified));
			created.setLanguage(extractAsString(dataset, DCTerms.language));
			created.setLandingPage(extractAsString(dataset, DCAT.landingPage));
			created.setKeyword(extractMultipleLanguageLiterals(dataset, DCAT.keyword));
			created.setContact(extractContact(dataset));
			created.setPublisher(extractPublisher(dataset));
			created.setTheme(extractTheme(dataset, DCAT.theme));
		}
		if (catalog != null) {
			created.setCatalog(CatalogBuilder.create(catalog));
		}

		return created;
	}
	
}
