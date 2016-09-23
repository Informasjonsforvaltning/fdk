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

        logger.debug("HARVESTER APPLICATION STARTED");


   /*     System.out.println("Let's inspect the beans provided by Spring Boot:");

        String[] beanNames = ctx.getBeanDefinitionNames();
        Arrays.sort(beanNames);
        for (String beanName : beanNames) {
            System.out.println(beanName);
        }*/

   /*
        // connect to ES
        Client client = null;
        logger.info("Starting HARVESTER Application");
        try {
            client = TransportClient.builder().build()
                    .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("es"),9300));
        } catch (UnknownHostException e) {
            // TODO Auto-generated catch block
            logger.error("ERROR: "+ e.getMessage());
        }

        logger.info("Client is connected " + client.toString());
*/

    }

}