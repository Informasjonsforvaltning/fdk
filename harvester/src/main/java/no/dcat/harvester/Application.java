package no.dcat.harvester;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import no.dcat.harvester.crawler.CrawlerJob;
import no.dcat.harvester.crawler.Loader;
import no.dcat.harvester.crawler.handlers.ElasticSearchResultHandler;
import no.difi.dcat.datastore.domain.DcatSource;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;

@SpringBootApplication
public class Application {
    static Logger logger = LoggerFactory.getLogger(Application.class);


    @Bean
    public static LoadingCache<URL, String> getBrregCache() {
        logger.debug("Starting BRREG cache 2!");

		LoadingCache<URL, String> brregCache = CacheBuilder.newBuilder().maximumSize(1000)
				.build(new CacheLoader<URL, String>() {
					public String load(URL url) throws Exception {
						try (InputStream inputStream = url.openStream()) {
							return IOUtils.toString(inputStream);
						}
					}
				});

		return brregCache;
    }



    public static void main(String[] args) {

        logger.debug("STARTING HARVESTER APPLICATION");

        ApplicationContext ctx = SpringApplication.run(Application.class, args);

        if (args.length == 1 ) {
            logger.debug("open file: "+ args[0]);
            loadDatasetFromFile(args[0]);
        }

        logger.debug("HARVESTER APPLICATION STARTED");



    }


    public static void loadDatasetFromFile(String filename) {
        Loader loader = new Loader();

        loader.loadDatasetFromFile(filename);

    }

}