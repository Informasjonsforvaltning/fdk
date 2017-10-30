package no.difi.dcat.datastore.domain.dcat;

import no.dcat.shared.Catalog;
import no.dcat.shared.DataTheme;
import no.dcat.shared.Dataset;
import no.dcat.shared.Distribution;
import no.dcat.shared.PeriodOfTime;
import no.dcat.shared.SkosCode;
import no.dcat.shared.Subject;
import no.dcat.shared.Types;
import no.difi.dcat.datastore.domain.dcat.builders.CatalogBuilder;
import no.difi.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.difi.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.difi.dcat.datastore.domain.dcat.smoke.TestCompleteCatalog;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

public class DatasetConverterTest {
    private static Logger logger = LoggerFactory.getLogger(DatasetConverterTest.class);

    static Catalog catalog;
    static Dataset expectedDataset, actualDataset;

    @BeforeClass
    public static void setup() {
        catalog = TestCompleteCatalog.getCompleteCatalog();

        String catalogUri = catalog.getUri();
        expectedDataset = catalog.getDataset().get(0);

        String datasetUri = expectedDataset.getUri();

        DcatBuilder dcatBuilder = new DcatBuilder();

        String dcat = dcatBuilder.transform(catalog, "TURTLE");

        logger.info("dcat: {} ", dcat);

        Model model = ModelFactory.createDefaultModel();
        model.read(new ByteArrayInputStream(dcat.getBytes()),null, "TTL");

        ResIterator catalogIterator = model.listResourcesWithProperty(RDF.type, DCAT.Catalog);
        ResIterator datasetIterator = model.listResourcesWithProperty(RDF.type, DCAT.Dataset);

        Resource catalogResource = catalogIterator.next();
        Resource datasetResource = datasetIterator.next();

        Catalog actualCatalog = CatalogBuilder.create(model.getResource(catalogUri));

        Map<String, SkosCode> locations = new HashMap<>();
        addCode(locations, "Norge", "http://sws.geonames.org/3144096/");
        addCode(locations, "Røyken", "http://www.geonames.org/3141104/royken.html");
        addCode(locations, "Asker", "http://www.geonames.org/3162656/asker.html");
        addCode(locations, "Hurum", "http://www.geonames.org/3151404/hurum.html");
        addCode(locations, "Bærum", "http://www.geonames.org/3162212/baerum.html");

        Map<String, Map<String, SkosCode>> codes = new HashMap<>();
        codes.put(Types.provenancestatement.getType(), new HashMap<>());
        addCode2(codes.get(Types.provenancestatement.getType()),"Vedtak", "Vedtak", "http://data.brreg.no/datakatalog/provenance/vedtak");

        codes.put(Types.linguisticsystem.getType(), new HashMap<>());
        addCode2(codes.get(Types.linguisticsystem.getType()), "Norsk", "NOR", "http://publications.europa.eu/resource/authority/language/NOR");

        codes.put(Types.rightsstatement.getType(), new HashMap<>());
        addCode2(codes.get(Types.rightsstatement.getType()),"Offentlig", "PUBLIC","http://publications.europa.eu/resource/authority/access-right/PUBLIC");
        addCode2(codes.get(Types.rightsstatement.getType()),"Begrenset", "RESTRICTED","http://publications.europa.eu/resource/authority/access-right/RESTRICTED");
        addCode2(codes.get(Types.rightsstatement.getType()),"Untatt offentlighet","NON-PUBLIC", "http://publications.europa.eu/resource/authority/access-right/NON-PUBLIC");

        codes.put(Types.frequency.getType(), new HashMap<>());
        addCode2(codes.get(Types.frequency.getType()), "Årlig", "ANUAL","http://publications.europa.eu/resource/authority/frequency/ANNUAL");

        codes.put(Types.referencetypes.getType(), new HashMap<>());
        addCode2(codes.get(Types.referencetypes.getType()), "references", "references", DCTerms.references.getURI());
        addCode2(codes.get(Types.referencetypes.getType()), "Har versjon", "hasVersion", DCTerms.hasVersion.getURI());
        addCode2(codes.get(Types.referencetypes.getType()), "Er del av", "isPartOf", DCTerms.isPartOf.getURI());

        Map<String,DataTheme> dataThemeMap = new HashMap<>();
        DataTheme gove = new DataTheme();
        gove.setUri("http://publications.europa.eu/resource/authority/data-theme/GOVE");
        gove.setCode("GOVE");
        DataTheme envi = new DataTheme();
        envi.setUri("http://publications.europa.eu/resource/authority/data-theme/ENVI");
        envi.setCode("ENVI");

        dataThemeMap.put("http://publications.europa.eu/resource/authority/data-theme/GOVE", gove);
        dataThemeMap.put("http://publications.europa.eu/resource/authority/data-theme/ENVI", envi);

        DatasetBuilder builder = new DatasetBuilder(model, locations,codes,dataThemeMap);
        List<Dataset> dataset = builder.build();
        actualDataset = dataset.get(0); //DatasetBuilder.create(model.getResource(datasetUri), catalogResource , locations, codes, dataThemeMap);

        logger.info("java: {}", actualDataset.toString());
    }

    @Test
    public void hasAccuracyAnnotation() throws Throwable {
        assertThat(actualDataset.getHasAccuracyAnnotation(), is (expectedDataset.getHasAccuracyAnnotation()));
    }

    @Test
    public void hasReferences() throws Throwable {
        logger.info("number of references {}", actualDataset.getReferences().size());
        assertThat(actualDataset.getReferences(), is (expectedDataset.getReferences()));
    }

    @Test
    public void hasLanguage() throws Throwable {
        logger.info("number of languages {}", actualDataset.getLanguage().size());
        assertThat(actualDataset.getLanguage().get(0), is (expectedDataset.getLanguage().get(0)));
    }


    @Test
    public void hasType() throws Throwable {
        logger.info("type {}", actualDataset.getType());

        assertThat(actualDataset.getType(), is(expectedDataset.getType()));
    }

    @Test
    public void hasAccessRight() throws Throwable {
        logger.info("accessRight {}", actualDataset.getAccessRights());

        assertThat(actualDataset.getAccessRights(), is(expectedDataset.getAccessRights()));
    }

    @Test
    public void hasObjective() throws Throwable {
        logger.info("objective {}", actualDataset.getObjective());

        assertThat(actualDataset.getObjective(), is(expectedDataset.getObjective()));
    }

    @Test
    public void hasSubject() throws Throwable {
        logger.info("subjects {}", actualDataset.getSubject());

        Subject actualSubject = actualDataset.getSubject().get(0);
        Subject expectedSubject = expectedDataset.getSubject().get(0);

        assertThat(actualSubject.getUri(), is(expectedSubject.getUri()));
        assertThat(actualSubject.getPrefLabel(), is(expectedSubject.getPrefLabel()));
        assertThat(actualSubject.getDefinition(), is(expectedSubject.getDefinition()));
        assertThat(actualSubject.getNote(), is(expectedSubject.getNote()));
        assertThat(actualSubject.getSource(), is(expectedSubject.getSource()));
    }


    @Test
    public void checkContactPoints() throws Throwable {
        expectedDataset.getContactPoint().get(0).setId(null);
        assertThat(actualDataset.getContactPoint(), is(expectedDataset.getContactPoint()));
    }

    @Test
    public void checkMiscProperties() throws Throwable {

        Collections.sort(actualDataset.getSpatial(), new SkosCodeComparer());
        Collections.sort(expectedDataset.getSpatial(), new SkosCodeComparer());
        assertThat("spatial", actualDataset.getSpatial(), is (expectedDataset.getSpatial()));

        Collections.sort(actualDataset.getTemporal(), new PeriodOfTimeComparer());
        Collections.sort(expectedDataset.getTemporal(), new PeriodOfTimeComparer());
        assertThat("temporal", actualDataset.getTemporal(), is (expectedDataset.getTemporal()));

        assertThat("conformsTo", actualDataset.getConformsTo(), is (expectedDataset.getConformsTo()));
    }

    @Test
    public void checkDistribution() throws Throwable {
        Distribution actualDist = actualDataset.getDistribution().get(0);
        Distribution expectedDist =  expectedDataset.getDistribution().get(0);

        assertThat("description", actualDist.getDescription(), is (expectedDist.getDescription()));
        assertThat("licence", actualDist.getLicense(), is (expectedDist.getLicense()));
        assertThat("conformsTo", actualDist.getConformsTo(), is (expectedDist.getConformsTo()));
        assertThat("format", actualDist.getFormat(), is (expectedDist.getFormat()));
        assertThat("accessURL", actualDist.getAccessURL(), is (expectedDist.getAccessURL()));
        assertThat("page", actualDist.getPage(), is (expectedDist.getPage()));

    }

    @Test
    public void checkQuality() throws Throwable {
        logger.info("quality: {}", actualDataset.getHasAccuracyAnnotation());
        assertThat(actualDataset.getHasAccuracyAnnotation(), is(expectedDataset.getHasAccuracyAnnotation()));
        assertThat(actualDataset.getHasAvailabilityAnnotation(), is(expectedDataset.getHasAvailabilityAnnotation()));
        assertThat(actualDataset.getHasCompletenessAnnotation(), is(expectedDataset.getHasCompletenessAnnotation()));
        assertThat(actualDataset.getHasCurrentnessAnnotation(), is(expectedDataset.getHasCurrentnessAnnotation()));
    }

    @Test
    public void checkThemes() throws Throwable {
        int count = 0;
        for (DataTheme expectedTheme : expectedDataset.getTheme()) {

            for (DataTheme actualTheme: actualDataset.getTheme()) {
                if (actualTheme.getUri().equals(expectedTheme.getUri())){
                    count++;
                    break;
                }
            }
        }

        assertThat(count, is (expectedDataset.getTheme().size()));
    }

    @Test
    @Ignore
    public void java2dcatAndBack() throws Throwable {
        actualDataset.setId(null);
        expectedDataset.setId(null);
        assertThat(actualDataset, is(expectedDataset));
    }


    public static void addCode(Map<String,SkosCode> codeList, String nbLabel, String uri) {
        SkosCode code = new SkosCode();
        code.setUri(uri);
        Map<String,String> prefLabel = new HashMap<>();
        prefLabel.put("nb", nbLabel );
        code.setPrefLabel(prefLabel);
        codeList.put(uri, code);

    }

    public static void addCode2(Map<String,SkosCode> codeList, String nbLabel, String codeValue, String uri) {
        SkosCode code = new SkosCode();
        code.setUri(uri);
        Map<String,String> prefLabel = new HashMap<>();
        prefLabel.put("nb", nbLabel );
        code.setPrefLabel(prefLabel);
        code.setCode(codeValue);
        codeList.put(uri, code);

    }

    public class PeriodOfTimeComparer implements Comparator<PeriodOfTime> {
        @Override
        public int compare(PeriodOfTime time1, PeriodOfTime time2) {
            int start = -1;
            if (time1.getStartDate() != null && time2.getStartDate() != null) {
                start = time1.getStartDate().compareTo(time2.getStartDate());
            } else if (time1.getStartDate() == null) {
                start = -1;
            } else if (time2.getStartDate() == null) {
                start = 1;
            }
            int end = 1;
            if (time1.getEndDate() != null && time2.getEndDate() != null) {
                end = time1.getEndDate().compareTo(time2.getEndDate());
            }

            if (start == 0) {
                return end;
            }

            return start;
        }
    }

    public class SkosCodeComparer implements Comparator<SkosCode> {

        @Override
        public int compare(SkosCode code1, SkosCode code2) {
            return code1.getUri().compareTo(code2.getUri());
        }
    }
}
