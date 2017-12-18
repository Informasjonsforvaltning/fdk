package no.dcat.harvester.crawler;

import no.dcat.datastore.domain.DcatSource;
import org.apache.jena.rdf.model.Model;

import java.util.List;

public interface CrawlerResultHandler {
	
	public void process(DcatSource dcatSource, Model model, List<String> validationResults);

}
