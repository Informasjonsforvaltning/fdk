package no.dcat.harvester.crawler;

import no.dcat.datastore.domain.dcat.Publisher;
import no.dcat.datastore.domain.dcat.builders.PublisherBuilder;
import no.fdk.test.testcategories.IntegrationTest;
import org.apache.jena.rdf.model.Model;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

@Category(IntegrationTest.class)
public class CrawlerPublisherIT {
    private static Logger logger = LoggerFactory.getLogger(CrawlerPublisherIT.class);

    /**
     * Test organization path. Dependent on Enhetsregisteret.
     */
    @Test
    public void orgPathOK() throws Throwable {

        Resource r = new ClassPathResource("organizations.ttl");

        // Crawler brregAgentConverter should generate organization paths in model
        Model model = new CrawlerJob(null, null, null)
            .loadModelAndValidate(r.getURL());

        //model.write(System.out, "TURTLE");

        // convert publishers to java
        List<Publisher> publishers = new PublisherBuilder(model).build();

        Map<String, Publisher> publisherMap = new HashMap<>();
        publishers.forEach(publisher -> {
            logger.info("orgnr: {} -> {}, {} {}", publisher.getId(), publisher.getOrgPath(), publisher.getName(), publisher.getNaeringskode());
            publisherMap.put(publisher.getId(), publisher);
        });

        // check selected publishers
        assertThat(publisherMap.get("910888447").getOrgPath(), is("/ANNET/910888447"));
        assertThat(publisherMap.get("875265172").getOrgPath(), is("/KOMMUNE/944496394/875265172"));
        assertThat(publisherMap.get("974760673").getOrgPath(), is("/STAT/912660680/974760673"));
        assertThat(publisherMap.get("981522427").getOrgPath(), is("/FYLKE/942116217/981522427"));
        assertThat(publisherMap.get("919781513").getOrgPath(), is("/PRIVAT/919781513"));
    }

}
