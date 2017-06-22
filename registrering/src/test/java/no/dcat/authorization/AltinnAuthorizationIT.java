package no.dcat.authorization;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

/**
 * Created by dask on 22.06.2017.
 */

// -Djavax.net.ssl.keyStore=D:/altinn/brreg.jks -Djavax.net.ssl.keyStorePassword=keystore
// -Djavax.net.debug=ssl

public class AltinnAuthorizationIT {

    private static Logger logger = LoggerFactory.getLogger(AltinnAuthorizationIT.class);

    private AuthorizationService authorizationService;

    @Before
    public void setup () {
        authorizationService = new AuthorizationService();
        ReflectionTestUtils.setField(authorizationService,"altinnServiceUrl", "https://tt02.altinn.no/");
        ReflectionTestUtils.setField(authorizationService,"altinnServiceCode", "4814");
        ReflectionTestUtils.setField(authorizationService,"altinnServiceEdition", "3");
    }

    @Test
    public void testGetAuthorizedEntities() throws Throwable {

        List<Entity> actualEntities = authorizationService.getAuthorizedEntities("02084902333");

        logger.info("# of entities {}", actualEntities.size());
        for (Entity entity : actualEntities) {
            logger.info("Entity {}", entity.toString());
        }
    }

    @Test
    public void testGetAuthorizedEntitiesInvalidUser() throws Throwable {

        try {
            List<Entity> actualEntities = authorizationService.getAuthorizedEntities("16079411314");
        } catch (HttpClientErrorException e) {
            logger.info("Client error: {}", e.getMessage());
            Assert.assertTrue(true);
        }

    }



}
