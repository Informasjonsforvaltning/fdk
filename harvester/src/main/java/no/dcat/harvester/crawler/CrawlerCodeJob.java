package no.dcat.harvester.crawler;

import no.dcat.harvester.crawler.client.RetrieveRemote;
import org.apache.jena.rdf.model.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Crawler for harvesting and load elasticsearch with codes.
 */
public class CrawlerCodeJob implements Runnable {
    private final Logger logger = LoggerFactory.getLogger(CrawlerCodeJob.class);

    private final List<CrawlerResultHandler> handlers;
    private final String sourceUrl;

    protected CrawlerCodeJob(String sourceUrl,
                             CrawlerResultHandler... handlers) {
        this.handlers = Arrays.asList(handlers);
        this.sourceUrl = sourceUrl;
    }

    /**
     * Creates an RDF-format model consisting of the defined code-set.
     * The codes are then extracted and loaded into elastic search into index codes/<type of code>.
     */
    @Override
    public void run() {
        logger.debug("Load codes through URL: {}", sourceUrl);
        //Dataset dataset = RDFDataMgr.loadDataset(dcatSource.getUrl());
        Model model = RetrieveRemote.remoteRDF(sourceUrl);

        for (CrawlerResultHandler handler : handlers) {
            handler.process(null, model);
        }
    }
}
