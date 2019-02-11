package no.dcat.harvester.crawler.converters;

import no.fdk.test.testcategories.UnitTest;
import org.hamcrest.core.Is;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Category(UnitTest.class)
public class PublisherOrganizationNumberAndNameTest {
    Logger logger = LoggerFactory.getLogger(PublisherOrganizationNumberAndNameTest.class);

    String expected;
    EnhetsregisterResolver enhetsregisterResolver = new EnhetsregisterResolver();

    @Before
    public void setup() throws Throwable {
        expected = "974760983";
    }

    @Test
    public void testExtractOrgnrFromURI() throws Throwable {
        String actual = enhetsregisterResolver.getOrgNrFromUri("http://data.brreg.no/enhetsregisteret/enhet/974760983");

        Assert.assertThat(actual, Is.is(expected));
    }

    @Test
    public void testExtractOrgnrFromURIWithXml() {
        String actual = enhetsregisterResolver.getOrgNrFromUri("http://data.brreg.no/enhetsregisteret/enhet/974760983.xml");

        Assert.assertThat(actual, Is.is(expected));
    }

    @Test
    public void testExtractOrgnrFromURIWithjson() {
        String actual = enhetsregisterResolver.getOrgNrFromUri("http://data.brreg.no/enhetsregisteret/enhet/974760983.json");

        Assert.assertThat(actual, Is.is(expected));
    }

    @Test
    public void testExtractOrgnrFromLongUri() {
        String actual = enhetsregisterResolver.getOrgNrFromUri("http://data.brreg.no/enhetsregisteret/enhet/974760983/fovar.xml");

        Assert.assertThat(actual, Is.is(expected));
    }

    @Test
    public void testExtractOrgnrOnlyFindsFirstNumber() {
        String actual = enhetsregisterResolver.getOrgNrFromUri("http://data.brreg.no/enhetsregisteret/enhet/974760983/fovar32.xml");

        Assert.assertThat(actual, Is.is(expected));
    }


}
