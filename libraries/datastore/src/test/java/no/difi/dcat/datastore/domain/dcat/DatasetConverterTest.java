package no.difi.dcat.datastore.domain.dcat;

import no.dcat.shared.Catalog;
import no.dcat.shared.DataTheme;
import no.dcat.shared.Dataset;
import no.dcat.shared.SkosCode;
import no.dcat.shared.Types;
import no.difi.dcat.datastore.domain.dcat.builders.CatalogBuilder;
import no.difi.dcat.datastore.domain.dcat.builders.DatasetBuilder;
import no.difi.dcat.datastore.domain.dcat.builders.DcatBuilder;
import no.difi.dcat.datastore.domain.dcat.data.CompleteCatalog;
import no.difi.dcat.datastore.domain.dcat.vocabulary.DCAT;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.RDF;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

public class DatasetConverterTest {
    private static Logger logger = LoggerFactory.getLogger(DatasetConverterTest.class);

    @Test
    public void dcat2Java() throws Throwable {
        Catalog catalog  = CompleteCatalog.getCompleteCatalog();

        String catalogUri = catalog.getUri();
        no.dcat.shared.Dataset expectedDataset = catalog.getDataset().get(0);
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
        addCode(codes.get(Types.provenancestatement.getType()),"Vedtak", "http://data.brreg.no/datakatalog/provenance/vedtak");

        codes.put(Types.linguisticsystem.getType(), new HashMap<>());
        addCode(codes.get(Types.linguisticsystem.getType()), "Norsk", "http://publications.europa.eu/resource/authority/language/NOR");

        codes.put(Types.rightsstatement.getType(), new HashMap<>());
        addCode(codes.get(Types.rightsstatement.getType()),"Offentlig", "http://publications.europa.eu/resource/authority/access-right/PUBLIC");

        codes.put(Types.frequency.getType(), new HashMap<>());
        addCode(codes.get(Types.frequency.getType()), "Årlig", "http://publications.europa.eu/resource/authority/frequency/ANNUAL");

        codes.put(Types.referencetypes.getType(), new HashMap<>());
        addCode(codes.get(Types.referencetypes.getType()), "references", "references");

        Map<String,DataTheme> dataThemeMap = new HashMap<>();
        dataThemeMap.put("http://publications.europa.eu/resource/authority/data-theme/GOVE", new DataTheme());
        dataThemeMap.put("http://publications.europa.eu/resource/authority/data-theme/ENVI", new DataTheme());

        Dataset actualDataset = DatasetBuilder.create(model.getResource(datasetUri), catalogResource , locations, codes, dataThemeMap);

        logger.info("java: {}", actualDataset.toString());

        assertThat(actualDataset.getHasAccuracyAnnotation(), is (expectedDataset.getHasAccuracyAnnotation()));
        assertThat(actualDataset.getReferences(), is (expectedDataset.getReferences()));

        assertThat(actualDataset, is(expectedDataset));

    }

    public void addCode(Map<String,SkosCode> codeList, String nbLabel, String uri) {
        SkosCode code = new SkosCode();
        code.setUri(uri);
        Map<String,String> prefLabel = new HashMap<>();
        prefLabel.put("nb", nbLabel );
        code.setPrefLabel(prefLabel);
        codeList.put(uri, code);
    }
}
