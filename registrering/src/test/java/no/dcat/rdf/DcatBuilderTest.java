package no.dcat.rdf;

import no.dcat.factory.RegistrationFactory;
import no.dcat.model.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;

import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertThat;

/**
 * Created by dask on 12.04.2017.
 */
@ActiveProfiles(value = "develop")
@RunWith(SpringRunner.class)
@SpringBootTest
public class DcatBuilderTest {

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
        catalog.setUri(RegistrationFactory.INSTANCE.getCatalogUri(catalog.getId()));

        Publisher publisher = new Publisher();
        publisher.setId("987654321");
        publisher.setName("TESTETATEN");
        publisher.setUri("http://data.brreg.no/enhetsregisteret/enhet/987654321");

        catalog.setPublisher(publisher);

        Dataset dataset = RegistrationFactory.INSTANCE.createDataset(catalog.getId());
        catalog.setDataset(singletonList(dataset));

        dataset.setTitle(map("nb", "Datasettittel"));
        dataset.setDescription(map("nb", "Datasettbeskrivelse"));

        Contact contact = RegistrationFactory.INSTANCE.createContact(catalog.getId());
        contact.setFullname("Fullname");
        contact.setEmail("test@testetaten.no");
        contact.setHasURL("http://testetaten.no/url");
        contact.setHasTelephone("+47444444444");
        contact.setOrganizationName("Testetaten");
        contact.setOrganizationUnit("Enhet A");

        dataset.setContactPoint(singletonList(contact));

        List<Map<String, String>> keywords = new ArrayList<>();
        keywords.add(map("nb", "Emneord 1"));
        keywords.add(map("nb", "Emneord 2"));

        dataset.setKeyword(keywords);
        dataset.setPublisher(publisher);
        dataset.setIssued(Date.from(LocalDateTime.of(2016,12,24,12,30).toInstant(ZoneOffset.UTC)));
        dataset.setModified(Date.from(LocalDateTime.of(2017,01,20,13,25,3).toInstant(ZoneOffset.UTC)));
        dataset.setLanguage(singletonList(skosCode(
                "http://publications.europa.eu/resource/authority/language/NOR",
                "NOR",
                map("nb", "Norsk"))));

        dataset.setLandingPage(singletonList("http://testetaten.no/landingsside/nr1"));
        DataTheme theme = new DataTheme();
        theme.setUri("http://publications.europa.eu/resource/authority/data-theme/GOVE");
        dataset.setTheme(singletonList(theme));

        Distribution distribution = RegistrationFactory.INSTANCE.createDistribution(catalog.getId(), dataset.getId());
        distribution.setAccessURL(singletonList("http://testetaten.no/data/access"));
        distribution.setTitle(map("nb", "Standard data"));
        distribution.setDescription(map("nb", "Beskrivelsen er ikke tilgjengelig"));
        distribution.setLicense("http://opne.data.no/lisens/nr1");
        distribution.setFormat(singletonList("application/json"));

        dataset.setDistribution(singletonList(distribution));
        dataset.setConformsTo(singletonList("http://norsk-lov"));

        PeriodOfTime pot = new PeriodOfTime();
        pot.setStartDate(Date.from(LocalDateTime.of(2017,1,1,0,0).toInstant(ZoneOffset.UTC)));
        pot.setEndDate(Date.from(LocalDateTime.of(2017,12,31,23,59,59,99).toInstant(ZoneOffset.UTC)));
        dataset.setTemporal(singletonList(pot));

        dataset.setSpatial(singletonList(skosCode("http://sws.geonames.org/3144096/", null, map("nb", "Norge"))));
        dataset.setAccessRights(skosCode("http://publications.europa.eu/resource/authority/access-right/RESTRICTED"));
        dataset.setAccessRightsComment(singletonList("http://hjemmeldata.no/du-må-vente"));
        dataset.setReferences(singletonList("http://testeetatens.no/catalog/2/dataset/42"));
        dataset.setProvenance(skosCode("http://data.brreg.no/datakatalog/provenance/vedtak"));
        dataset.setIdentifier(singletonList("42"));
        dataset.setPage(singletonList("http://uri1"));
        dataset.setAccrualPeriodicity(skosCode("http://publications.europa.eu/resource/authority/frequency/CONT"));

        List<String> subjects = new ArrayList<>();
        subjects.add("http://testetaten.no/begrep/4450");
        subjects.add("http://testetaten.no/begrep/4599");

        dataset.setSubject(subjects);

        dataset.setAdmsIdentifier(singletonList("http://adms.identifier.no/scheme/42"));

        return catalog;
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
