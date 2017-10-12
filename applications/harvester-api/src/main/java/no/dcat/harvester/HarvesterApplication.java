package no.dcat.harvester;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

import java.io.InputStream;
import java.net.URL;

@SpringBootApplication
public class HarvesterApplication {
    static Logger logger = LoggerFactory.getLogger(HarvesterApplication.class);


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


        SpringApplication.run(HarvesterApplication.class, args);


    }

}
