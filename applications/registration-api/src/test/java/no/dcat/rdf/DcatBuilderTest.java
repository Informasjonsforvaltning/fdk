package no.dcat.rdf;

import no.dcat.factory.RegistrationFactory;
import no.dcat.model.Catalog;
import no.dcat.model.Contact;
import no.dcat.model.DataTheme;
import no.dcat.model.Dataset;
import no.dcat.model.Distribution;
import no.dcat.model.PeriodOfTime;
import no.dcat.model.Publisher;
import no.dcat.model.QualityAnnotation;
import no.dcat.model.SkosCode;
import no.dcat.model.SkosConceptWithHomepage;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

/**
 * Created by dask on 12.04.2017.
 */
@ActiveProfiles(value = "develop")
public class DcatBuilderTest {
    static Logger logger = LoggerFactory.getLogger(DcatBuilderTest.class);

    DcatBuilder builder;

    @Before
    public void setUp() {
        builder = new DcatBuilder();

    }

    public Catalog createCompleteCatalog() {
        Catalog catalog = new Catalog();
        catalog.setId("987654321");
        catalog.setTitle(map("nb", "Tittel"));
        catalog.setDescription(map("nb", "Beskrivelse"));
        catalog.setUri(RegistrationFactory.getCatalogUri(catalog.getId()));

        Publisher publisher = new Publisher();
        publisher.setId("987654321");
        publisher.setName("TESTETATEN");
        publisher.setUri("http://data.brreg.no/enhetsregisteret/enhet/987654321");

        catalog.setPublisher(publisher);

        Dataset dataset = RegistrationFactory.createDataset(catalog.getId());
        catalog.setDataset(Collections.singletonList(dataset));

        dataset.setTitle(map("nb", "Datasettittel"));
        dataset.setDescription(map("nb", "Datasettbeskrivelse"));

        Contact contact = RegistrationFactory.createContact(catalog.getId());
        contact.setFullname("Fullname");
        contact.setEmail("test@testetaten.no");
        contact.setHasURL("http://testetaten.no/url");
        contact.setHasTelephone("+47444444444");
        contact.setOrganizationName("Testetaten");
        contact.setOrganizationUnit("Enhet A");

        dataset.setContactPoint(Collections.singletonList(contact));

        List<Map<String, String>> keywords = new ArrayList<>();
        keywords.add(map("nb", "Emneord 1"));
        keywords.add(map("nb", "Emneord 2"));

        dataset.setKeyword(keywords);
        dataset.setPublisher(publisher);
        dataset.setIssued(Date.from(LocalDateTime.of(2016,12,24,12,30).toInstant(ZoneOffset.UTC)));
        dataset.setModified(Date.from(LocalDateTime.of(2017,01,20,13,25,3).toInstant(ZoneOffset.UTC)));
        dataset.setLanguage(Collections.singletonList(skosCode(
                        "http://publications.europa.eu/resource/authority/language/NOR",
                        "NOR",
                        map("nb", "Norsk"))));

        dataset.setLandingPage(Collections.singletonList("http://testetaten.no/landingsside/nr1"));
        DataTheme theme = new DataTheme();
        theme.setUri("http://publications.europa.eu/resource/authority/data-theme/GOVE");
        dataset.setTheme(Collections.singletonList(theme));

        Distribution distribution = RegistrationFactory.createDistribution(catalog.getId(), dataset.getId());
        distribution.setAccessURL(Collections.singletonList("http://testetaten.no/data/access"));
        distribution.setTitle(map("nb", "Standard data"));
        distribution.setDescription(map("nb", "Beskrivelsen er ikke tilgjengelig"));
        distribution.setLicense("http://opne.data.no/lisens/nr1");
        distribution.setFormat(Collections.singletonList("application/json"));

        dataset.setDistribution(Collections.singletonList(distribution));
        dataset.setConformsTo(Collections.singletonList("http://norsk-lov"));

        PeriodOfTime pot = new PeriodOfTime();
        pot.setStartDate(Date.from(LocalDateTime.of(2017,1,1,0,0).toInstant(ZoneOffset.UTC)));
        pot.setEndDate(Date.from(LocalDateTime.of(2017,12,31,23,59,59,99).toInstant(ZoneOffset.UTC)));
        dataset.setTemporal(Collections.singletonList(pot));

        dataset.setSpatial(Collections.singletonList(skosCode("http://sws.geonames.org/3144096/", null, map("nb", "Norge"))));
        dataset.setAccessRights(skosCode("http://publications.europa.eu/resource/authority/access-right/RESTRICTED"));
        dataset.setLegalBasisForRestriction(Collections.singletonList(SkosConceptWithHomepage.getInstance("https://lovdata.no/dokument/NL/lov/1992-12-04-126", "Lov om arkiv [arkivlova]")));
        dataset.setReferences(Collections.singletonList("http://testeetatens.no/catalog/2/dataset/42"));
        dataset.setProvenance(skosCode("http://data.brreg.no/datakatalog/provenance/vedtak"));
        dataset.setIdentifier(Collections.singletonList("42"));
        dataset.setPage(Collections.singletonList("http://uri1"));
        dataset.setAccrualPeriodicity(skosCode("http://publications.europa.eu/resource/authority/frequency/CONT"));

        List<String> subjects = new ArrayList<>();
        subjects.add("http://testetaten.no/begrep/4450");
        subjects.add("http://testetaten.no/begrep/4599");

        dataset.setSubject(subjects);

        dataset.setAdmsIdentifier(Collections.singletonList("http://adms.identifier.no/scheme/42"));

        dataset.setHasCurrentnessAnnotation(createQualityAnnotation("Currentness", "Ferskere blir det ikke"));
        dataset.setHasAccuracyAnnotation(createQualityAnnotation("Accuracy", "Millimeternøyaktighet"));

        logger.debug("hasCurrentnessAnnotation:\n {}", dataset.getHasCurrentnessAnnotation());

        return catalog;
    }

    QualityAnnotation createQualityAnnotation(String dimension, String text) {
        QualityAnnotation qualityAnnotation = new QualityAnnotation();
        qualityAnnotation.setInDimension(dimension);
        Map<String,String> value = new HashMap<>();
        value.put("no", text);
        qualityAnnotation.setHasBody(value);

        return qualityAnnotation;
    }

    @Test
    public void convertCompleteCatalogOK() throws Throwable {
        builder = new DcatBuilder();
        Catalog catalog = createCompleteCatalog();

        String actual = builder.transform(catalog, "TURTLE");

        assertThat(actual, is(notNullValue()));
        System.out.println(actual);
    }

    SkosCode skosCode(String uri, String code, Map<String,String> prefLabel) {
        SkosCode result = new SkosCode();
        result.setUri(uri);
        result.setCode(code);
        result.setPrefLabel(prefLabel);

        return result;
    }

    SkosCode skosCode(String uri) {
        SkosCode result = new SkosCode();
        result.setUri(uri);

        return result;
    }

    @Test
    public void convertMinimumCatalogOK() throws Throwable {
        builder = new DcatBuilder();
        Catalog catalog = new Catalog();

        String actual = builder.transform(catalog, "TURTLE");

        assertThat(actual, is(notNullValue()));
        System.out.println(actual);
    }


    public Map<String,String> map(String lang, String value) {
        Map<String, String> result = new HashMap<>();
        result.put(lang, value);

        return result;
    }
}
