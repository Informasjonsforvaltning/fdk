package no.fdk.imcat;

import no.fdk.test.testcategories.IntegrationTest;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

@ActiveProfiles("unit-integration")
@Category(IntegrationTest.class)
@RunWith(SpringRunner.class)
@SpringBootTest()
public class AltInnDummyLoad {
    private static final Logger logger = LoggerFactory.getLogger(AltInnDummyLoad.class);

    @Ignore
    @Test
    public void testLoadSomeInformationModelsIntoDB() {
        //Kommenter ut denne linjen i InformationmodelHarvester.java (linje 75 per juli 2019) : sources.addAll(apiRegistrationsHarvest.getHarvestSources());

        //Bytt ut denne linjen i applikation.yml:
        // harvestSourceURIBase: ${FDK_ALTINN_MODELS_URL:https://fdk-dev-altinn.appspot.com/api/v1/schemas}
        // med
        //harvestSourceURIBase: ${FDK_ALTINN_MODELS_URL:file:///git/fdk/applications/concept-cat/src/main/resources/altaltinnsmall.txt}
        //men MERK: finn stien på din disk til altinnsmall.txt

        logger.debug("In do-nothing test - The spring framework will start and harvest information models ");
    }
}
