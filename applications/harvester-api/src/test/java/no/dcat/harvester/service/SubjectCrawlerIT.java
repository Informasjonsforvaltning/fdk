package no.dcat.harvester.service;

import no.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.dcat.datastore.domain.dcat.builders.DcatReader;
import no.dcat.shared.Catalog;
import no.dcat.shared.Dataset;
import no.dcat.shared.Subject;
import no.fdk.test.testcategories.IntegrationTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.ByteArrayInputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

@ActiveProfiles(value = "unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest
@Category(IntegrationTest.class)
public class SubjectCrawlerIT {
    private static Logger logger = LoggerFactory.getLogger(SubjectCrawlerIT.class);
    private final String catalogUri = "http://dcat.no/catalog/1234";
    Catalog catalog;
    @Autowired
    private SubjectCrawler subjectCrawler;

    @Before
    public void setup() {
        Subject subject1 = new Subject();
        subject1.setUri("https://data-david.github.io/Begrep/begrep/Hovedenhet");

        Subject subject2 = new Subject();
        subject2.setUri("https://data-david.github.io/Begrep/begrep/Enhet");
        subject2.setPrefLabel(new HashMap<>());
        subject2.getPrefLabel().put("no", "enheiten");

        Subject subject3 = new Subject();
        subject3.setUri("https://data-david.github.io/Begrep/begrep/Organisasjonsnummer");
        subject3.setPrefLabel(new HashMap<>());
        subject3.getPrefLabel().put("no", "Orgid");
        subject3.setDefinition(new HashMap<>());
        subject3.getDefinition().put("no", "organisasjonsnr er et unikt nummer");

        Dataset dataset1 = new Dataset();
        dataset1.setId("1");
        dataset1.setUri(catalogUri + "/datasets/1");
        dataset1.setSubject(Arrays.asList(subject1, subject2));

        Dataset dataset2 = new Dataset();
        dataset2.setId("2");
        dataset2.setUri(catalogUri + "/datasets/2");
        dataset2.setSubject(Arrays.asList(subject3));

        catalog = new Catalog();
        catalog.setId("1234");
        catalog.setUri(catalogUri);
        catalog.setDataset(Arrays.asList(dataset1, dataset2));
    }

    @Test
    public void harvestSimpleDatasetAddsSubjectDefinitions() throws Throwable {
        String modelAsString = DcatBuilder.transform(catalog, "TURTLE");

        Model model = ModelFactory.createDefaultModel();
        model.read(new ByteArrayInputStream(modelAsString.getBytes()), null, "TURTLE");


        Model actual = subjectCrawler.annotateSubjects(model);

        //actual.write(System.out, "TURTLE");

        DcatReader reader = new DcatReader(model);
        List<Subject> actualSubjects = reader.getSubjects();

        assertThat(actualSubjects.size(), is(3));

        actualSubjects.forEach(subject -> {
            assertThat(subject.getPrefLabel().get("no"), is(notNullValue()));
        });

    }
}
