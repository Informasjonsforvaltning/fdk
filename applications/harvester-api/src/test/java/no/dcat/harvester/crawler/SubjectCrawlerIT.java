package no.dcat.harvester.crawler;

import no.dcat.datastore.domain.dcat.builders.DcatReader;
import no.dcat.harvester.service.SubjectCrawler;
import no.dcat.shared.Dataset;
import no.dcat.shared.Subject;
import no.fdk.test.testcategories.IntegrationTest;
import org.apache.jena.rdf.model.Model;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.text.SimpleDateFormat;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest
@Category(IntegrationTest.class)
public class SubjectCrawlerIT {
    static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    private static Logger logger = LoggerFactory.getLogger(SubjectCrawlerIT.class);
    @Autowired
    SubjectCrawler subjectCrawler;

    public DcatReader setupReader(Model model) {
        return new DcatReader(model, "http://localhost:8100", "user", "password");
    }


    @Test
    public void readDcatWithSubjectReference() throws Throwable {
        Resource r = new ClassPathResource("begrepHarvest.ttl");
        Model model = new CrawlerJob(null, null, subjectCrawler).loadModelAndValidate(r.getURL());

        //model.write(System.out, "TURTLE");

        DcatReader reader = setupReader(model);
        List<Subject> actualSubjects = reader.getSubjects();

        assertThat(actualSubjects.size(), is(1));
        Subject actualSubject = actualSubjects.get(0);

        assertThat(actualSubject.getPrefLabel().get("no"), is("enhet"));
        assertThat(actualSubject.getCreator().getUri(), is("http://data.brreg.no/enhetsregisteret/enhet/974760673"));
    }


    @Test
    public void readCompleteDifiData() throws Throwable {

        Resource r = new ClassPathResource("difi-complete-2017-10-25.jsonld");
        Model model = new CrawlerJob(null, null, subjectCrawler).loadModelAndValidate(r.getURL());

        DcatReader reader = setupReader(model);
        List<Dataset> datasets = reader.getDatasets();

        datasets.forEach(dataset -> {
            if (dataset.getDistribution() != null) {
                dataset.getDistribution().forEach(distribution -> {
                    logger.debug("{}: {}", dataset.getUri(), distribution.getFormat());
                    if (distribution.getFormat() != null && distribution.getFormat().size() > 0) {
                        String firstFormat = distribution.getFormat().get(0);
                        assertThat(firstFormat, is(notNullValue()));
                    }

                });
            }
        });

        assertThat(datasets.size(), is(484));
    }


}
