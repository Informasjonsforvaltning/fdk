package no.difi.dcat.harvester.crawler;

import org.apache.jena.rdf.model.Model;

import no.difi.dcat.datastore.domain.DcatSource;

public interface CrawlerResultHandler {
	
	public void process(DcatSource dcatSource, Model model);

}
