package no.dcat.datastore.domain.dcat;

import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.dcat.shared.*;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.vocabulary.RDF;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URL;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by nodavsko on 01.11.2016.
 */

@Category(UnitTest.class)
public class DatasetTest {

    static private Logger logger = LoggerFactory.getLogger(DatasetTest.class);

    private DcatSource dcatSource;
    private Dataset data;

    public static Map<String, Map<String, SkosCode>> initializeCodes() {
        Map<String, Map<String, SkosCode>> codes = new HashMap<>();
        codes.put(Types.provenancestatement.getType(), generateCode("statlig vedtak", "http://data.brreg.no/datakatalog/provinens/vedtak"));
        codes.put(Types.linguisticsystem.getType(), generateCode("norsk", "http://publications.europa.eu/resource/authority/language/2"));
        codes.put(Types.rightsstatement.getType(), generateCode("Offentlig", "http://publications.europa.eu/resource/authority/access-right/PUBLIC"));
        codes.put(Types.frequency.getType(), generateCode("kontinuerlig", "http://publications.europa.eu/resource/authority/frequency/CONT"));
        codes.put(Types.referencetypes.getType(), generateCode("references", "references"));

        return codes;
    }

    public static Map<String, SkosCode> generateCode(String norwegianTitle, String code) {
        Map titles = new HashMap();
        titles.put("no", norwegianTitle);

        SkosCode skosCode = new SkosCode(code, "code", titles);
        Map<String, SkosCode> CodeMap = new HashMap<>();

        CodeMap.put(code, skosCode);
        return CodeMap;
    }

    @Before
    public void setup() {
        URL url = this.getClass().getClassLoader().getResource("catalog.ttl");
        logger.info("Open file: " + url.toString());
        dcatSource = new DcatSource("http//dcat.no/test", "Test", url.toString(), "admin_user", "123456789");
        org.apache.jena.query.Dataset dataset = RDFDataMgr.loadDataset(dcatSource.getUrl());
        Model model = ModelFactory.createUnion(ModelFactory.createDefaultModel(), dataset.getDefaultModel());
        ResIterator catalogIterator = model.listResourcesWithProperty(RDF.type, DCAT.Catalog);
        ResIterator datasetIterator = model.listResourcesWithProperty(RDF.type, DCAT.Dataset);

        Resource catalogResource = catalogIterator.next();
        Resource datasetResource = datasetIterator.next();

        Map<String, SkosCode> locations = generateCode("Norge", "http://sws.geonames.org/3144096/");

        data = DatasetBuilder.create(datasetResource, catalogResource, locations, initializeCodes(), new HashMap<>());
    }

    @Test
    public void publisherExists() {
        no.dcat.shared.Publisher actual = data.getPublisher();

        Publisher expected = new Publisher();
        expected.setUri("http://data.brreg.no/enhetsregisteret/enhet/974760673");
        expected.setName("Brønnøysundregistrene");
        expected.setPrefLabel(new HashMap<>());
        expected.getPrefLabel().put("no", "Brønnøysundregistrene");

        logger.debug(actual.getUri());
        logger.debug(actual.getName());

        Assert.assertEquals("Expects uri", expected.getUri(), actual.getUri());
        Assert.assertEquals("Expects name", expected.getName(), actual.getName());
        //Assert.assertEquals("Expects prefLabel", expected.getPrefLabel().get("no"), actual.getPrefLabel().get("no"));
    }

    @Test
    public void contactExists() {
        Contact actual = data.getContactPoint().get(0);
        Contact expected = new Contact();
        expected.setUri("http://data.brreg.no/datakatalog/kontaktpunkt/4");
        expected.setFullname("Kontakt for Altinn");
        expected.setHasTelephone("+4775007500");
        expected.setEmail("bjarne.base@brreg.no");
        expected.setOrganizationName("Skatt");
        expected.setOrganizationUnit("AAS");
        expected.setHasURL("httpd://skatt.no/schema");

        Assert.assertEquals("id expected", expected.getUri(), actual.getUri());
        Assert.assertEquals("id expected", expected.getFullname(), actual.getFullname());
        Assert.assertEquals("id expected", expected.getHasTelephone(), actual.getHasTelephone());
        Assert.assertEquals("id expected", expected.getEmail(), actual.getEmail());
        Assert.assertEquals("Org. name expected", expected.getOrganizationName(), actual.getOrganizationName());
        Assert.assertEquals("Org. unit expected", expected.getOrganizationUnit(), actual.getOrganizationUnit());
        Assert.assertEquals("Url expected", expected.getHasURL(), actual.getHasURL());
    }

    @Test
    public void datasetProperties() throws ParseException {
        Dataset expected = new Dataset();
        expected.setIdentifier(Arrays.asList("10"));
        expected.setSubject(Arrays.asList(new Subject("http://brreg.no/begrep/orgnr", null, null)));

        SkosCode accrualPeriodicity = new SkosCode("http://publications.europa.eu/resource/authority/frequency/CONT", "CONT", new HashMap<String, String>());
        accrualPeriodicity.getPrefLabel().put("no", "kontinuerlig");
        expected.setAccrualPeriodicity(accrualPeriodicity);

        expected.setPage(Arrays.asList("https://www.brreg.no/lag-og-foreninger/registrering-i-frivillighetsregisteret/"));
        expected.setAdmsIdentifier(Arrays.asList("http://data.brreg.no/identifikator/99"));
        expected.setType("Type");

        SkosCode accessRight = new SkosCode("http://publications.europa.eu/resource/authority/access-right/PUBLIC", "PUBLIC", new HashMap<String, String>());
        accessRight.getPrefLabel().put("no", "Offentlig");
        expected.setAccessRights(accessRight);

        expected.setDescription(createMapOfStrings("Oversikt over lag og foreninger som er registrert i Frivillighetsregisteret.  Har som formål å bedre og forenkle samhandlingen mellom frivillige organisasjoner og offentlige myndigheter. Registeret skal sikre systematisk informasjon som kan styrke legitimiteten til og kunnskapen om den frivillige aktiviteten. Registeret er lagt til Brønnøysundregistrene og åpnet for registrering 2. desember 2008"));
        expected.setIssued(createDate("01-01-2009 00:00:00"));
        expected.setLandingPage(Arrays.asList("https://w2.brreg.no/frivillighetsregisteret/"));

        SkosCode language = new SkosCode("http://publications.europa.eu/resource/authority/language/2", "2", new HashMap<String, String>());
        language.getPrefLabel().put("no", "norsk");
        SkosCode language2 = new SkosCode("http://publications.europa.eu/resource/authority/language/3", "3", new HashMap<String, String>());
        expected.setLanguage(Arrays.asList(language, language2));

        SkosCode provinance = new SkosCode("http://data.brreg.no/datakatalog/provinens/vedtak", "vedtak", new HashMap<String, String>());
        provinance.getPrefLabel().put("no", "statlig vedtak");
        expected.setProvenance(provinance);

        expected.setTitle(createMapOfStrings("Frivillighetsregisteret"));

        expected.setSpatial(createListOfMaps("http://sws.geonames.org/3144096/", "Norge"));

        Assert.assertEquals(expected.getIdentifier(), data.getIdentifier());
        Assert.assertEquals(expected.getSubject(), data.getSubject());
        Assert.assertEquals(expected.getAccrualPeriodicity().getUri(), data.getAccrualPeriodicity().getUri());
        Assert.assertEquals(expected.getPage(), data.getPage());
        Assert.assertEquals(expected.getAdmsIdentifier(), data.getAdmsIdentifier());
        Assert.assertEquals(expected.getType(), data.getType());
        Assert.assertEquals(expected.getAccessRights().getUri(), data.getAccessRights().getUri());
        Assert.assertEquals(expected.getDescription().get("nb"), data.getDescription().get("nb"));
        Assert.assertEquals(expected.getIssued(), data.getIssued());
        Assert.assertEquals(expected.getLandingPage(), data.getLandingPage());
        Assert.assertEquals(expected.getLanguage().get(0).getUri(), data.getLanguage().get(0).getUri());
        Assert.assertThat(expected.getLanguage().size(), Matchers.is(2));
        Assert.assertEquals(expected.getProvenance().getUri(), data.getProvenance().getUri());
        Assert.assertEquals(expected.getSpatial().get(0).getUri(), data.getSpatial().get(0).getUri());
        Assert.assertEquals(expected.getSpatial().get(0).getPrefLabel().get("no"), data.getSpatial().get(0).getPrefLabel().get("no"));
        Assert.assertEquals(expected.getTitle(), data.getTitle());
    }

    private Date createDate(String dateInString) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("dd-M-yyyy hh:mm:ss");
        return sdf.parse(dateInString);
    }


    private List<SkosCode> createListOfMaps(String code, String title) {
        SkosCode co = new SkosCode();
        co.setUri(code);

        Map<String, String> map = new HashMap<>();
        map.put("no", title);

        co.setPrefLabel(map);

        List<SkosCode> list = new ArrayList<>();
        list.add(co);
        return list;
    }

    private Map<String, String> createMapOfStrings(String data) {
        Map map = new HashMap<String, String>();
        map.put("nb", data);
        return map;
    }
}
