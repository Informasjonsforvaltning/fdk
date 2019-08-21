package no.dcat.authorization;

import no.fdk.test.testcategories.IntegrationTest;
import org.junit.Assert;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

/**
 * Created by dask on 22.06.2017.
 */

// -Djavax.net.ssl.keyStore=D:/altinn/brreg.jks -Djavax.net.ssl.keyStorePassword=keystore
// -Djavax.net.debug=ssl

@ActiveProfiles("unit-integration")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Category(IntegrationTest.class)
public class AltinnAuthorizationIT {

    private static Logger logger = LoggerFactory.getLogger(AltinnAuthorizationIT.class);

    @Autowired
    private AuthorizationService authorizationService;


    @Test
    public void testGetAuthorizedEntities() throws Throwable {

        List<Entity> actualEntities = authorizationService.getAuthorizedEntities("02084902333");

        Assert.assertNotNull(actualEntities);
        assertThat(actualEntities.size(), is(3));

        logger.info("# of entities {}", actualEntities.size());
        for (Entity entity : actualEntities) {
            logger.info("Entity {}", entity.toString());
        }

    }

    @Test(expected = AuthorizationServiceException.class)
    public void testGetAuthorizedEntitiesInvalidUser() throws Throwable {
        List<String> actualEntities = authorizationService.getOrganisations("16079411314");
    }


}
