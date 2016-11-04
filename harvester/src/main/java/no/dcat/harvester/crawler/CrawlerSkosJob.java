package no.dcat.harvester.crawler;

import no.dcat.harvester.crawler.client.RetrieveRemote;
import no.difi.dcat.datastore.AdminDataStore;
import no.difi.dcat.datastore.domain.DcatSource;
import no.difi.dcat.datastore.domain.DifiMeta;
import org.apache.jena.atlas.web.HttpException;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.shared.JenaException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
        Model model = RetrieveRemote.remoteRDF(skosUrl);

        try {
            for (CrawlerResultHandler handler : handlers) {
                handler.process(themeSource, model);
            }
        } catch (JenaException e) {
            String message = e.getMessage();

            try {
                if (message.contains("[line: ")) {
                    String[] split = message.split("]");
                    split[0] = "";
                    message = Arrays.stream(split)
                            .map(i -> i.toString())
                            .collect(Collectors.joining("]"));
                    message = message.substring(1, message.length()).trim();
                }
            } catch (Exception e2) {
            }
            if (adminDataStore != null) adminDataStore.addCrawlResults(themeSource, DifiMeta.syntaxError, message);
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", themeSource.toString(), e.toString()), e);

        } catch (HttpException e) {
            if (adminDataStore != null)
                adminDataStore.addCrawlResults(themeSource, DifiMeta.networkError, e.getMessage());
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", themeSource.toString(), e.toString()), e);
        } catch (Exception e) {
            logger.error(String.format("[crawler_operations] [fail] Error running crawler job: %1$s, error=%2$s", themeSource.toString(), e.toString()), e);
            if (adminDataStore != null) adminDataStore.addCrawlResults(themeSource, DifiMeta.error, e.getMessage());
        }
    }
}