package no.dcat.harvester;

import no.dcat.datastore.domain.DcatSource;
import no.dcat.datastore.domain.dcat.vocabulary.DCATNO;
import no.fdk.test.testcategories.UnitTest;
import org.apache.jena.query.Dataset;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.RDFDataMgr;
import org.junit.Test;
import org.junit.experimental.categories.Category;

import java.io.IOException;

import static org.junit.Assert.assertTrue;

/**
 * Created by bjg on 19.10.2017.
 */
@Category(UnitTest.class)
public class DatasetSortRankingCreatorTest {

    @Test
    public void datasetsFromRegistrationComponentInternalURIShouldBeRatedA() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Rank datasets. This is the code that is being tested
        DatasetSortRankingCreator rankingCreator = new DatasetSortRankingCreator();
        Model ranked = rankingCreator.rankDatasets(model, "http://registration-api:8080/catalog/1234");

        //Ranking for dataset in property DCATNO.source should start with A
        Resource dcatRes = model.getResource("http://data.brreg.no/datakatalog/dataset/27");
        Literal source = dcatRes.getProperty(DCATNO.source).getLiteral();


        assertTrue("Dataset rank should start with A", source.toString().startsWith("A"));
    }

    @Test
    public void datasetsFromRegistrationComponentExternalURIShouldBeRatedA() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Rank datasets. This is the code that is being tested
        DatasetSortRankingCreator rankingCreator = new DatasetSortRankingCreator();
        Model ranked = rankingCreator.rankDatasets(model, "http://registrering-fdk.brreg.no/catalog/1234");

        //Ranking for dataset in property DCATNO.source should start with A
        Resource dcatRes = model.getResource("http://data.brreg.no/datakatalog/dataset/27");
        Literal source = dcatRes.getProperty(DCATNO.source).getLiteral();


        assertTrue("Dataset rank should start with A", source.toString().startsWith("A"));
    }

    @Test
    public void datasetsNotFromRegistrationComponentShouldBeRatedB() throws IOException {

        //Prepare test code
        Model model = loadTestModel("datasett-mini.ttl");

        //Rank datasets. This is the code that is being tested
        DatasetSortRankingCreator rankingCreator = new DatasetSortRankingCreator();
        Model ranked = rankingCreator.rankDatasets(model, "http://some-other.domain.no/catalog/1234");

        //Ranking for dataset in property DCATNO.source should start with A
        Resource dcatRes = model.getResource("http://data.brreg.no/datakatalog/dataset/27");
        Literal source = dcatRes.getProperty(DCATNO.source).getLiteral();


        assertTrue("Dataset rank should start with B", source.toString().startsWith("B"));
    }


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
}
