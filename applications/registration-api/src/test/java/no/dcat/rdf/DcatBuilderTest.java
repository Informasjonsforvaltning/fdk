package no.dcat.rdf;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
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
import no.dcat.model.SkosConcept;
import no.dcat.shared.Subject;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.context.ActiveProfiles;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
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

        dataset.setTitle(map("nb", "Markagrensen Oslo Kommune og nærliggende kommuner"));
        dataset.setDescription(map("nb", "Datasettet avgrenser område for virkeområdet til lov 6. juni 2009 nr. 35 om naturområder i Oslo og nærliggende kommuner (markaloven) som trådte i kraft 1. september 2009. Markalovens virkeområde er fastsatt i forskrift 4. september 2015 nr. 1032 om justering av markagrensen fastlegger markalovens geografiske virkeområde med tilhørende kart."));
        dataset.setObjective(map("nb", "Datasettes formål er nullam quis rius eget urna mollis ornare vel eu leo. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Vestibulum id ligula porta felis euismod semper."));

        dataset.setType("Kodeliste");

        List<Map<String, String>> keywords = new ArrayList<>();
        keywords.add(map("nb", "Bestemmelse"));
        keywords.add(map("nb", "jord"));
        keywords.add(map("nb", "regulering"));
        keywords.add(map("nb", "statlig bestemmelse"));
        dataset.setKeyword(keywords);

        dataset.setAccessRights(
                skosCode("http://publications.europa.eu/resource/authority/access-right/RESTRICTED",
                        "RESTRICTED", map("nb", "Begrenset")));

        Contact contact = RegistrationFactory.createContact(catalog.getId());

        contact.setEmail("digitalisering@kartverket.no");
        contact.setHasURL("http://testetaten.no/url");
        contact.setHasTelephone("22306022");
        contact.setOrganizationUnit("Avdeling for digitalisering");

        dataset.setContactPoint(Collections.singletonList(contact));
        SkosConcept sosi =SkosConcept.getInstance("https://www.kartverket.no/geodataarbeid/standarder/sosi/", "SOSI", "dct:Standard");
        dataset.setConformsTo(Collections.singletonList(sosi));

        dataset.setPublisher(publisher);

        dataset.setInformationModel(Collections.singletonList(
                SkosConcept.getInstance("https://www.w3.org/2004/02/skos/", "SKOS", null)));

        Subject subject = new Subject();
        subject.setDefinition(map("no","alt som er registrert med et organisasjonsnummer "));
        subject.setPrefLabel(map("no","enhet"));
        subject.setNote(map("no", "Alle hovedenheter, underenheter og organisasjonsledd som er identifisert med et organisasjonsnummer."));
        subject.setSource("https://jira.brreg.no/browse/BEGREP-208");
        subject.setUri("https://data-david.github.io/Begrep/begrep/Enhet");
        dataset.setSubject(Collections.singletonList(
                subject
        ));

        dataset.setAccrualPeriodicity(skosCode("http://publications.europa.eu/resource/authority/frequency/ANNUAL", "ANNUAL", map("nb","årlig")));

        dataset.setIssued(Date.from(LocalDateTime.of(2012,01,01,00,00).toInstant(ZoneOffset.UTC)));
        dataset.setModified(Date.from(LocalDateTime.of(2016,9,21,01,30,3).toInstant(ZoneOffset.UTC)));

        dataset.setProvenance(skosCode("http://data.brreg.no/datakatalog/provenance/vedtak", "vedtak", map("nb", "Vedtak")));
        dataset.setHasCurrentnessAnnotation(createQualityAnnotation("Currentness", "Denne teksten sier noe om aktualiteten. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."));
        dataset.setSpatial(Arrays.asList(
                skosCode("http://www.geonames.org/3162656/asker.html", null, map("nb", "Asker")),
                skosCode("http://www.geonames.org/3162212/baerum.html", null, map("nb", "Bærum")),
                skosCode("http://www.geonames.org/3151404/hurum.html", null, map("nb", "Hurum")),
                skosCode("http://www.geonames.org/3141104/royken.html", null, map("nb", "Røyken"))
                ));

        dataset.setHasRelevanceAnnotation(createQualityAnnotation("Relevance", "Denne teksten sier noe om relevansen. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Cum sociis natoque penatibus et magnis dis parturient montes."));
        dataset.setHasCompletenessAnnotation(createQualityAnnotation("Completeness", "Denne teksten sier noe om komplettheten. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum."));
        dataset.setHasAccuracyAnnotation(createQualityAnnotation("Accuracy", "Denne teksten sier noe om nøyaktigheten. Cras mattis consectetur purus sit."));
        dataset.setHasAvailabilityAnnotation(createQualityAnnotation("Availability", "Denne teksten sier noe om tilgjengeligheten. Vestibulum id ligula porta felis euismod semper. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum."));

        dataset.setLanguage(Collections.singletonList(skosCode(
                        "http://publications.europa.eu/resource/authority/language/NOR",
                        "NOR",
                        map("nb", "Norsk"))));

        dataset.setLandingPage(Collections.singletonList("http://testetaten.no/landingsside/nr1"));
        DataTheme theme = new DataTheme();
        theme.setUri("http://publications.europa.eu/resource/authority/data-theme/GOVE");
        theme.setTitle(map("nb","Forvaltning og offentlig støtte"));

        DataTheme theme2 = new DataTheme();
        theme2.setUri("http://publications.europa.eu/resource/authority/data-theme/ENVI");
        theme2.setTitle(map("nb", "Miljø"));

        dataset.setTheme(Arrays.asList(theme, theme2));

        Distribution distribution = RegistrationFactory.createDistribution(catalog.getId(), dataset.getId());
        distribution.setAccessURL(Arrays.asList("http://www.detteerenlenke.no/til-nedlasting",
                "http://www.detteerenannenlenke.no/til-en-annen-nedlasting",
                "http://www.detteerentredjelenke.no/til-en-tredje-nedlasting"));
        distribution.setDescription(map("nb", "Dette er beskrivelsen av distribusjonen. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Vestibulum id ligula porta felis euismod semper con desbit arum. Se dokumentasjon for denne distribusjonen."));
        distribution.setLicense(sosi);
        distribution.setPage(SkosConcept.getInstance("http://lenke/til/mer/info", "Dokumentasjon av distribusjonen"));
        distribution.setFormat(Collections.singletonList("application/json"));

        dataset.setDistribution(Collections.singletonList(distribution));

        Distribution sample = RegistrationFactory.createDistribution(catalog.getId(), dataset.getId());
        sample.setDescription(map("nb", "Dette er beskrivelsen av eksempeldataene. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."));
        sample.setFormat(Arrays.asList("application/rdf+xml"));
        sample.setAccessURL(Arrays.asList("http://www.detteerenlenke.no/til-nedlasting"));

        dataset.setSample(Arrays.asList(sample));

        PeriodOfTime pot = new PeriodOfTime();
        pot.setStartDate(Date.from(LocalDateTime.of(2017,1,1,0,0).toInstant(ZoneOffset.UTC)));
        pot.setEndDate(Date.from(LocalDateTime.of(2017,12,31,23,59,59,99).toInstant(ZoneOffset.UTC)));
        dataset.setTemporal(Collections.singletonList(pot));

        dataset.setLegalBasisForRestriction(Arrays.asList(
                SkosConcept.getInstance("https://lovdata.no/dokument/NL/lov/1992-12-04-126", "Lov om arkiv [arkivlova]"),
                SkosConcept.getInstance("http://lovdata/paragraph/20", "Den spesifikke loven § 20"),
                SkosConcept.getInstance("http://lovdata/paragraph/26", "Den mindre spesifikke loven § 26")));
        dataset.setLegalBasisForProcessing(Arrays.asList(SkosConcept.getInstance("http://lovdata/paragraph/2", "Den andre loven med lenger tittel § 2")));

        dataset.setLegalBasisForAccess(Arrays.asList(
                SkosConcept.getInstance("http://lovdata/paragraph/10", "Den siste loven med den lengste tittelen § 10")));

        dataset.setReferences(Collections.singletonList("http://testeetatens.no/catalog/2/dataset/42"));
        dataset.setIdentifier(Collections.singletonList("42"));
        dataset.setPage(Collections.singletonList("http://uri1"));

        dataset.setAdmsIdentifier(Collections.singletonList("http://adms.identifier.no/scheme/42"));

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
    public void convertCompleteCatalogToTurtleOK() throws Throwable {
        builder = new DcatBuilder();
        Catalog catalog = createCompleteCatalog();

        String actual = builder.transform(catalog, "TURTLE");

        assertThat(actual, is(notNullValue()));
        System.out.println(actual);
    }

    @Test
    public void convertCompleteCatalogToJsonOK() throws Throwable {
        builder = new DcatBuilder();
        Catalog catalog = createCompleteCatalog();
        JsonSerializer<Date> ser = new JsonSerializer<Date>() {
            @Override
            public JsonElement serialize(Date src, Type typeOfSrc, JsonSerializationContext
                    context) {
                return src == null ? null : new JsonPrimitive(src.getTime());
            }
        };
        //Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
        Gson gson = new GsonBuilder().registerTypeAdapter(Date.class, ser).setPrettyPrinting().create();

        String actual = gson.toJson(catalog);

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
