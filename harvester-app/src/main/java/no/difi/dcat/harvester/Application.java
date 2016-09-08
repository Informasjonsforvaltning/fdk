package no.difi.dcat.harvester;

import java.io.InputStream;
import java.net.URL;

import org.apache.commons.io.IOUtils;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

@SpringBootApplication
@EnableScheduling
public class Application extends SpringBootServletInitializer {

	@Bean
	public static LoadingCache<URL, String> getBrregCache() {
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

		SpringApplication.run(Application.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(Application.class);
	}

}