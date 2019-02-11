package no.dcat.harvester;

import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.dcat.vocabulary.DCAT;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.query.Dataset;
import org.apache.jena.rdf.model.*;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.vocabulary.DCTerms;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.io.IOException;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

/**
 * Created by bjg on 14.10.2016.
 */
@Category(UnitTest.class)
public class DataEnricherTest {

    /**
     * Helper method to load test data
     *
     * @param testFileName file name containing RDF DCAT model to be used in test
     * @return RDF DCAT model
     */
    private Model loadTestModel(String testFileName) {
        ClassLoader classLoader = getClass().getClassLoader();
        DcatSource dcatSource = new DcatSource("http//dcat.no/test", "Test", classLoader.getResource(testFileName).getFile(), "admin_user", "123456789");
        Dataset dataset = RDFDataMgr.loadDataset(dcatSource.getUrl());
        Model model = ModelFactory.createUnion(ModelFactory.createDefaultModel(), dataset.getDefaultModel());
        return model;
    }

    /**
     * Check that language is not empty for all title properties
     *
     * @throws IOException
     */
    @Test
    public void allTitlesHasLanguage() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Do the actual enricments. This is the code that is being tested
        DataEnricher enricher = new DataEnricher();
        Model enriched = enricher.enrichData(model);

        //Set to true if one or more titles is missing language
        boolean titleMissingLanguage = false;

        //Check if result is as expected - every title should have a non-empty language attribute
        StmtIterator titleIter = enriched.listStatements(new SimpleSelector(null, DCTerms.title, (RDFNode) null));
        while (titleIter.hasNext()) {
            Statement titleStmt = titleIter.next();
            Literal title = titleStmt.getObject().asLiteral();
            if (title.getLanguage().equals("")) {
                titleMissingLanguage = true;
            }
        }

        assertFalse("No titles should be without language", titleMissingLanguage);
    }


    /**
     * Check that language is not empty for all description properties
     *
     * @throws IOException
     */
    @Test
    public void allDescriptionsHasLanguage() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Do the actual enricments. This is the code that is being tested
        DataEnricher enricher = new DataEnricher();
        Model enriched = enricher.enrichData(model);

        //Set to true if one or more descrpitions is missing language
        boolean descriptionMissingLanguage = false;

        //Check if result is as expected - every descripition should have a non-empty language attribute
        StmtIterator descIter = enriched.listStatements(new SimpleSelector(null, DCTerms.description, (RDFNode) null));
        while (descIter.hasNext()) {
            Statement descStmt = descIter.next();
            Literal description = descStmt.getObject().asLiteral();
            if (description.getLanguage().equals("")) {
                descriptionMissingLanguage = true;
            }
        }

        assertFalse("No descriptions should be without language", descriptionMissingLanguage);
    }


    /**
     * Check that language is not empty for all keyword properties
     *
     * @throws IOException
     */
    @Test
    public void allKeywordsHasLanguage() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Do the actual enricments. This is the code that is being tested
        DataEnricher enricher = new DataEnricher();
        Model enriched = enricher.enrichData(model);

        //Set to true if one or more descrpitions is missing language
        boolean keywordMissingLanguage = false;

        //Check if result is as expected - every keyword should have a non-empty language attribute
        StmtIterator keywordIter = enriched.listStatements(new SimpleSelector(null, DCAT.keyword, (RDFNode) null));
        while (keywordIter.hasNext()) {
            Statement keywordStmt = keywordIter.next();
            Literal keyword = keywordStmt.getObject().asLiteral();
            if (keyword.getLanguage().equals("")) {
                keywordMissingLanguage = true;
            }
        }

        assertFalse("No keyword should be without language", keywordMissingLanguage);
    }

    /**
     * Check that default language assigned to title property is "nb"
     *
     * @throws IOException
     */
    @Test
    public void defaultTitleLanguageShouldBeNoNb() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Do the actual enricments. This is the code that is being tested
        DataEnricher enricher = new DataEnricher();
        Model enriched = enricher.enrichData(model);

        //Find statement where language is known to be missing in test data
        Resource dcatRes = model.getResource("http://data.brreg.no/datakatalog/dataset/7");
        Literal title = dcatRes.getProperty(DCTerms.title).getLiteral();
        String foundLanguage = title.getLanguage();

        assertEquals("Title: Default language should be nb", "nb", foundLanguage);
    }


    /**
     * Check that default language assigned to description property is "nb"
     *
     * @throws IOException
     */
    @Test
    public void defaultdescriptionLanguageShouldBeNoNb() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Do the actual enricments. This is the code that is being tested
        DataEnricher enricher = new DataEnricher();
        Model enriched = enricher.enrichData(model);

        //Find statement where language is known to be missing in test data
        Resource dcatRes = model.getResource("http://data.brreg.no/datakatalog/dataset/7");
        Literal desc = dcatRes.getProperty(DCTerms.description).getLiteral();
        String foundLanguage = desc.getLanguage();

        assertEquals("Description: Default language should be nb", "nb", foundLanguage);
    }


    /**
     * Check that default language assigned to keyword property is "nb"
     *
     * @throws IOException
     */
    @Test
    public void defaultkeywordLanguageShouldBeNoNb() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Do the actual enricments. This is the code that is being tested
        DataEnricher enricher = new DataEnricher();
        Model enriched = enricher.enrichData(model);

        //Find statement where language is known to be missing in test data
        Resource dcatRes = model.getResource("http://data.brreg.no/datakatalog/dataset/7");
        Literal kw = dcatRes.getProperty(DCAT.keyword).getLiteral();
        String foundLanguage = kw.getLanguage();

        assertEquals("Keyword: Default language should be nb", "nb", foundLanguage);
    }

    @Test
    public void ifLanguageIsEnItShouldBeKept() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Do the actual enricments. This is the code that is being tested
        DataEnricher enricher = new DataEnricher();
        Model enriched = enricher.enrichData(model);

        //Find statement where language is known to be missing in test data
        Resource dcatRes = model.getResource("http://data.brreg.no/datakatalog/dataset/27");
        Literal kw = dcatRes.getProperty(DCTerms.description).getLiteral();
        String foundLanguage = kw.getLanguage();

        assertEquals("Keyword: Default language should be nb", "en", foundLanguage);
    }


    /**
     * Check that language in source data is not overwritten by default
     *
     * @throws IOException
     */
    @Test
    public void alreadyPresentLanguageShouldNotBeOverwritten() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Do the actual enricments. This is the code that is being tested
        DataEnricher enricher = new DataEnricher();
        Model enriched = enricher.enrichData(model);

        //Find statement where language known to be present in test data
        //In this case: english (en)
        Resource dcatRes = model.getResource("http://data.brreg.no/datakatalog/dataset/27");
        Literal title = dcatRes.getProperty(DCTerms.title).getLiteral();
        String foundLanguage = title.getLanguage();

        assertEquals("Title with preexisting language should not be changed", "en", foundLanguage);
    }

    @Test
    public void descriptionShouldRemoveIllegalHTMLTags() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Do the actual enricments. This is the code that is being tested
        DataEnricher enricher = new DataEnricher();
        Model enriched = enricher.enrichData(model);

        //Find statement where language is known to be missing in test data
        Resource dcatRes = model.getResource("http://data.brreg.no/datakatalog/dataset/27");
        Literal desc = dcatRes.getProperty(DCTerms.description).getLiteral();
        String foundString = desc.getString();

        assertThat(foundString, is("Dataset with english description."));
    }


    @Test
    public void datanorgeDistributionLicensesShouldHaveSourceProperty() throws IOException {

        //Prepare test code
        Model model = loadTestModel("distribution-licenseformat-difi.jsonld");

        //Do the actual enricments. This is the code that is being tested
        DataEnricher enricher = new DataEnricher();
        Model enriched = enricher.enrichData(model);

        //Find license where dct:source should have been added
        Resource distributionRes = model.getResource("http://data.norge.no/node/967");
        RDFNode license = distributionRes.getProperty(DCTerms.license).getObject();

        assertEquals(
            license.asResource().getProperty(DCTerms.source).getLiteral().toString(),
            "http://data.norge.no/nlod/");
    }

}
