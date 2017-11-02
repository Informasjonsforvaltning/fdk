package no.dcat.harvester.crawler.converters;

import no.dcat.harvester.HarvesterApplication;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.util.FileManager;
import org.hamcrest.core.Is;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;

public class PublisherOrganizationNumberAndNameTest {
    Logger logger = LoggerFactory.getLogger(PublisherOrganizationNumberAndNameTest.class);

    String expected;
    BrregAgentConverter converter = new BrregAgentConverter(HarvesterApplication.getBrregCache());

    @Before
    public void setup() throws Throwable {
        expected = "974760983";
    }

    @Test
    public void testExtractOrgnrFromURI() throws Throwable {
        String actual = converter.getOrgnrFromUri("http://data.brreg.no/enhetsregisteret/enhet/974760983");

        Assert.assertThat(actual, Is.is(expected));
    }

    @Test
    public void testExtractOrgnrFromURIWithXml() throws Throwable {
        String actual = converter.getOrgnrFromUri("http://data.brreg.no/enhetsregisteret/enhet/974760983.xml");

        Assert.assertThat(actual, Is.is(expected));
    }

    @Test
    public void testExtractOrgnrFromURIWithjson() throws Throwable {
        String actual = converter.getOrgnrFromUri("http://data.brreg.no/enhetsregisteret/enhet/974760983.json");

        Assert.assertThat(actual, Is.is(expected));
    }

    @Test
    public void testExtractOrgnrFromLongUri() throws Throwable {
        String actual = converter.getOrgnrFromUri("http://data.brreg.no/enhetsregisteret/enhet/974760983/fovar.xml");

        Assert.assertThat(actual, Is.is(expected));
    }

    @Test
    public void testExtractOrgnrOnlyFindsFirstNumber() throws Throwable {
        String actual = converter.getOrgnrFromUri("http://data.brreg.no/enhetsregisteret/enhet/974760983/fovar32.xml");

        Assert.assertThat(actual, Is.is(expected));
    }


}
