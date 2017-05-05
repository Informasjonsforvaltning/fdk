package no.dcat.harvester.crawler;

import no.dcat.admin.store.domain.DcatSource;
import org.apache.jena.rdf.model.Model;

public interface CrawlerResultHandler {
	
	public void process(DcatSource dcatSource, Model model);

}
