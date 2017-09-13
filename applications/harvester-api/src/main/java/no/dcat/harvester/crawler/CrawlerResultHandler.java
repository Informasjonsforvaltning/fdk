package no.dcat.harvester.crawler;

import no.difi.dcat.datastore.domain.DcatSource;
import org.apache.jena.rdf.model.Model;

public interface CrawlerResultHandler {
	
	public void process(DcatSource dcatSource, Model model);

}
