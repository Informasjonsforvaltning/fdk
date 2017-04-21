package no.dcat.api;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import no.dcat.api.web.Key;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.concurrent.TimeUnit;

@SpringBootApplication
public class Application {


	@Bean
	public LoadingCache<Key, String> getDcatCache() {
		return CacheBuilder.newBuilder()
				.maximumSize(10)
				.expireAfterWrite(24, TimeUnit.HOURS)
				.build(
						new CacheLoader<Key, String>() {


							private final Logger logger = LoggerFactory.getLogger(CacheLoader.class);


							public String load(Key key) throws IOException {

								logger.error("CACHE MISS!!!");
								CloseableHttpResponse response1;
								HttpEntity entity;
								try (CloseableHttpClient httpclient = HttpClients.createDefault()) {

									HttpGet httpGet = new HttpGet(key.getUrl());

									httpGet.setHeader("Accept", key.getContentType());

									response1 = httpclient.execute(httpGet);
								}


								entity = response1.getEntity();

								return EntityUtils.toString(entity, Charset.forName("UTF-8"));


							}
						});

	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}


}