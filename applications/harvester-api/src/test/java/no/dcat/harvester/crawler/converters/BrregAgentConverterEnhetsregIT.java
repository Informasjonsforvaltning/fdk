package no.dcat.harvester.crawler.converters;

import no.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import no.dcat.harvester.HarvesterApplication;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.NodeIterator;
import org.apache.jena.rdf.model.ResIterator;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.util.FileManager;
import org.apache.jena.vocabulary.DCTerms;
import org.apache.jena.vocabulary.RDF;
import org.hamcrest.core.Is;
import org.junit.Assert;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.OutputStream;
import java.net.URL;
import java.nio.file.Paths;

import static org.junit.Assert.assertEquals;

public class BrregAgentConverterEnhetsregIT {
    Logger logger = LoggerFactory.getLogger(BrregAgentConverter.class);

    String expected;
    BrregAgentConverter converter = new BrregAgentConverter(HarvesterApplication.getBrregCache());


    @Test
    public void testConvertOnRDFWithIdentifier() throws Exception {
        BrregAgentConverter converter = new BrregAgentConverter(HarvesterApplication.getBrregCache());
        Model model = FileManager.get().loadModel("rdf/virksomheter.ttl");
        converter.collectFromModel(model);
        NodeIterator countryiter = model.listObjectsOfProperty(
                model.createResource("http://data.brreg.no/enhetsregisteret/enhet/991825827/forretningsadresse"),
                model.createProperty("http://data.brreg.no/meta/land"));
        assertEquals("Norge" , countryiter.next().asLiteral().getValue().toString());
    }

    @Test
    public void testConvertOnRDFReplaceCanonicalName() throws Exception {
        BrregAgentConverter converter = new BrregAgentConverter(HarvesterApplication.getBrregCache());
        Model model = FileManager.get().loadModel("rdf/virksomheter.ttl");
        converter.collectFromModel(model);
        NodeIterator nameiter = model.listObjectsOfProperty(
                model.createResource("http://data.brreg.no/enhetsregisteret/enhet/971040238"),
                FOAF.name);
        assertEquals("Kartverket" , nameiter.next().asLiteral().getValue().toString());
    }

    @Test
    public void organizationNameSubstitutionFromCanonicalTableOK() throws Throwable {
        Model model = FileManager.get().loadModel("oljedir.xml");

        Resource publisherResource = model.getResource("https://register.geonorge.no/register/organisasjoner/kartverket/difi");

        String previousName = publisherResource.getProperty(FOAF.name).getString();
        logger.info("name before {}",previousName);

        converter.collectFromModel(model);

        Resource newPublisherResource = model.getResource("http://data.brreg.no/enhetsregisteret/enhet/991825827");

        String newName = newPublisherResource.getProperty(FOAF.name).getString();

        OutputStream output2 = new ByteArrayOutputStream();
        model.write(output2, "TURTLE");
        logger.debug("[model_before_conversion] \n{}", output2.toString());

        logger.info("name after {}",newName);

        Assert.assertThat(newName, Is.is("DIFI"));
    }

    @Test
    public void organizationNumberFromGeonorgeForVegvesen() throws Throwable {
        Model model = FileManager.get().loadModel("geonorge-data-2017-10-19.xml");

        Resource publisherResource = model.getResource("https://register.geonorge.no/register/organisasjoner/kartverket/statens-vegvesen");

        String previousName = publisherResource.getProperty(FOAF.name).getString();
        logger.info("name before {}",previousName);

        converter.collectFromModel(model);

        Resource newPublisherResource = model.getResource("http://data.brreg.no/enhetsregisteret/enhet/971032081");

        String newName = newPublisherResource.getProperty(FOAF.name).getString();

        OutputStream output2 = new ByteArrayOutputStream();
        model.write(output2, "TURTLE");
        logger.debug("[model_before_conversion] \n{}", output2.toString());

        logger.info("name after {}",newName);

        Assert.assertThat(newName, Is.is("STATENS VEGVESEN"));
    }

    @Test
    public void organizationNumberInIdentifierUsesMasterRegistryNameOK() throws Throwable {
        Model model = FileManager.get().loadModel("oljedir.xml");

        Resource publisherResource = model.getResource("https://register.geonorge.no/register/organisasjoner/kartverket/oljedirektoratet");

        String previousName = publisherResource.getProperty(FOAF.name).getString();
        logger.info("name before {}",previousName);

        converter.collectFromModel(model);
        Resource newPublisherResource = model.getResource("http://data.brreg.no/enhetsregisteret/enhet/870917732");

        String newName = newPublisherResource.getProperty(FOAF.name).getString();

        OutputStream output2 = new ByteArrayOutputStream();
        model.write(output2, "TURTLE");
        logger.debug("[model_before_conversion] \n{}", output2.toString());

        logger.info("name after {}",newName);

        Assert.assertThat(newName, Is.is("OLJEDIREKTORATET"));
    }



    @Test
    public void organizationNameSubstitutionFromCanonicalTableWhenOfficalURIIsUsedOK() throws Throwable {
        Model model = FileManager.get().loadModel("oljedir.xml");

        Resource publisherResource = model.getResource("http://data.brreg.no/enhetsregisteret/enhet/971526920");

        String previousName = publisherResource.getProperty(FOAF.name).getString();
        logger.info("name before {}",previousName);

        converter.collectFromModel(model);

        String newName = publisherResource.getProperty(FOAF.name).getString();

        OutputStream output2 = new ByteArrayOutputStream();
        model.write(output2, "TURTLE");
        logger.debug("[model_before_conversion] \n{}", output2.toString());

        logger.info("name after {}",newName);

        Assert.assertThat(newName, Is.is("SSB"));
    }

    @Test
    public void testSamePublisherDifferentUri() throws Throwable {

        Model model = FileManager.get().loadModel("duplicatedPublisher.ttl");

        converter.collectFromModel(model);

        Resource datasetWithCorrectedPublisher = model.getResource("http://data.brreg.no/datakatalog/dataset/42");
        String publisherUri = datasetWithCorrectedPublisher.getProperty(DCTerms.publisher).getObject().toString();

        Assert.assertThat(publisherUri, Is.is("http://data.brreg.no/enhetsregisteret/enhet/981544315"));
    }


    @Test
    public void correctOrgpathKommune() throws Throwable {

        Model model = FileManager.get().loadModel("duplicatedPublisher.ttl");

        converter.collectFromModel(model);

        Resource hitraKommune = model.getResource("http://data.brreg.no/enhetsregisteret/enhet/938772924");
        String publisherUri = hitraKommune.getProperty(DCATNO.organizationPath).getString();

        Assert.assertThat(publisherUri, Is.is("/KOMMUNE/938772924"));
    }


    @Test
    public void correctOrgpathStat() throws Throwable {

        Model model = FileManager.get().loadModel("duplicatedPublisher.ttl");

        converter.collectFromModel(model);

        Resource landbruksdirektoratet = model.getResource("http://data.brreg.no/enhetsregisteret/enhet/981544315");
        String publisherUri = landbruksdirektoratet.getProperty(DCATNO.organizationPath).getString();

        Assert.assertThat(publisherUri, Is.is("/STAT/972417874/981544315"));
    }

    @Test
    public void correctOrgpathStatFromGeonorge() throws Throwable {

        Model model = FileManager.get().loadModel("publisherFromGeonorge.ttl");

        converter.collectFromModel(model);

        Resource landbruksdirektoratet = model.getResource("http://data.brreg.no/enhetsregisteret/enhet/981544315");
        String publisherUri = landbruksdirektoratet.getProperty(DCATNO.organizationPath).getString();

        Assert.assertThat(publisherUri, Is.is("/STAT/972417874/981544315"));
    }

    @Test
    public void correctOrgpathKommuneFromGeonorge() throws Throwable {

        Model model = FileManager.get().loadModel("publisherFromGeonorge.ttl");

        converter.collectFromModel(model);

        Resource hitraKommune = model.getResource("http://data.brreg.no/enhetsregisteret/enhet/938772924");
        String publisherUri = hitraKommune.getProperty(DCATNO.organizationPath).getString();

        Assert.assertThat(publisherUri, Is.is("/KOMMUNE/938772924"));
    }

    @Test
    public void testConvertUrl() throws Exception {
        BrregAgentConverter converter = new BrregAgentConverter(HarvesterApplication.getBrregCache());

        Model model = ModelFactory.createDefaultModel();

        String enhetsUri = "http://data.brreg.no/enhetsregisteret/enhet/981544315";

        URL uri = new URL(enhetsUri);

        converter.collectFromUri(uri.toString(), model, model.createResource(enhetsUri));

        ResIterator iterator = model.listResourcesWithProperty(RDF.type);

        assertEquals("Expected model to contain one resource.", "http://data.brreg.no/enhetsregisteret/enhet/972417874", iterator.nextResource().getURI());
        assertEquals("Expected model to contain one resource.", enhetsUri, iterator.nextResource().getURI());

        model.write(System.out, "TURTLE");
    }

}
