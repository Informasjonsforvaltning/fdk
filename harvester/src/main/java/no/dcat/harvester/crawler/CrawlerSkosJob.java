package no.dcat.harvester.crawler;

import no.dcat.admin.store.AdminDataStore;
import no.dcat.admin.store.domain.DcatSource;
import no.dcat.admin.store.domain.DifiMeta;
import no.dcat.harvester.crawler.client.RetrieveModel;
import org.apache.jena.atlas.web.HttpException;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.shared.JenaException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;

/**
 * Class for loading themes into elasticsearch. The rdf-formated Themes are retrieved from an URL.
 */
public class CrawlerSkosJob implements Runnable {
    private List<CrawlerResultHandler> handlers;
    private final DcatSource themeSource;
    private final AdminDataStore adminDataStore;
    private final String skosUrl;

    private final Logger logger = LoggerFactory.getLogger(CrawlerSkosJob.class);

    protected CrawlerSkosJob(DcatSource themeSource,
                             AdminDataStore adminDataStore,
                             String skosUrl,
                             CrawlerResultHandler... handlers) {
        this.themeSource = themeSource;
        this.adminDataStore = adminDataStore;
        this.handlers = Arrays.asList(handlers);
        this.skosUrl = skosUrl;
    }

    @Override
    public void run() {
        logger.info("[crawler_operations] [success] Started crawler job: {}", themeSource.toString());
        Model model = RetrieveModel.remoteRDF(skosUrl);

        try {
            for (CrawlerResultHandler handler : handlers) {
                handler.process(themeSource, model);
            }
        } catch (JenaException e) {
            String message = CrawlerJob.formatJenaException(e);
            if (adminDataStore != null) {
                adminDataStore.addCrawlResults(themeSource, DifiMeta.syntaxError, message);
            }
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", themeSource.toString(), e.toString()), e);

        } catch (HttpException e) {
            if (adminDataStore != null) {
                adminDataStore.addCrawlResults(themeSource, DifiMeta.networkError, e.getMessage());
            }
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", themeSource.toString(), e.toString()), e);
        } catch (Exception e) {
            if (adminDataStore != null) {
                adminDataStore.addCrawlResults(themeSource, DifiMeta.error, e.getMessage());
            }
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", themeSource.toString(), e.toString()), e);
        }
    }
}