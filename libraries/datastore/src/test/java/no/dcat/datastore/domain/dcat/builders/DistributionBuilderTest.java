package no.dcat.datastore.domain.dcat.builders;

import no.dcat.shared.Distribution;
import no.dcat.shared.SkosCode;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.rdf.model.Resource;
import org.junit.Assert;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.util.Map;


@Category(UnitTest.class)
public class DistributionBuilderTest {


    //Tests of the compareURLs helper method.
    @Test
    public void identicalUrlsWithDifferentProtocolsTestOK() {
        String distributionURL = "http://data.norge.no/nlod/";
        String openURL = "https://data.norge.no/nlod/";
        Assert.assertTrue(DistributionBuilder.compareURLs(distributionURL, openURL));
    }

    @Test
    public void identicalUrlsWithSameProtocolsTestOK() {
        String distributionURL = "http://data.norge.no/nlod/";
        String openURL = "http://data.norge.no/nlod/";
        Assert.assertTrue(DistributionBuilder.compareURLs(distributionURL, openURL));
    }

    @Test
    public void emptyDistributionURLTestKO() {
        String distributionURL = "";
        String openURL = "http://data.norge.no/nlod/";
        Assert.assertFalse(DistributionBuilder.compareURLs(distributionURL, openURL));
    }

    @Test
    public void emptyOpenURLTestKO() {
        String distributionURL = "http://data.norge.no/nlod/";
        String openURL = "";
        Assert.assertTrue(DistributionBuilder.compareURLs(distributionURL, openURL));
    }

    @Test
    public void openUrlIsSubstringOfDistributionUrlOK() {
        String distributionURL = "http://data.norge.no/nlod/dette/er/en/test";
        String openURL = "http://data.norge.no/nlod/";
        Assert.assertTrue(DistributionBuilder.compareURLs(distributionURL, openURL));
    }

    @Test
    public void openUrlIsNullKO() {
        String distributionURL = "http://data.norge.no/";
        String openURL = null;
        Assert.assertFalse(DistributionBuilder.compareURLs(distributionURL, openURL));
    }

    @Test
    public void distributionURLIsNullKO() {
        String distributionURL = null;
        String openURL = "http://data.norge.no/nlod/";
        Assert.assertFalse(DistributionBuilder.compareURLs(distributionURL, openURL));
    }

    //Test of create method with null values.
    @Test
    public void createWithNullValuesResourceTestKO() {
        Resource distResource = null;
        Map<String, Map<String, SkosCode>> codes = null;
        Distribution distribution = DistributionBuilder.create(distResource, codes);
        Assert.assertTrue(distribution != null);
    }
}
