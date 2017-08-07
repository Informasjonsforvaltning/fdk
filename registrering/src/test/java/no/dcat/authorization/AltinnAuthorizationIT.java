package no.dcat.authorization;

import no.dcat.RegisterApplication;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;

/**
 * Created by dask on 22.06.2017.
 */

// -Djavax.net.ssl.keyStore=D:/altinn/brreg.jks -Djavax.net.ssl.keyStorePassword=keystore
// -Djavax.net.debug=ssl

@RunWith(SpringRunner.class)
@SpringBootTest
//@ContextConfiguration(classes = {RegisterApplication.class})
public class AltinnAuthorizationIT {

    private static Logger logger = LoggerFactory.getLogger(AltinnAuthorizationIT.class);

    @Autowired
    private AuthorizationService authorizationService;

    @Test
    public void testGetAuthorizedEntities() throws Throwable {

        List<Entity> actualEntities = authorizationService.getAuthorizedEntities("02084902333");

        Assert.assertNotNull(actualEntities);

        logger.info("# of entities {}", actualEntities.size());
        for (Entity entity : actualEntities) {
            logger.info("Entity {}", entity.toString());
        }
    }

    @Test
    public void testGetAuthorizedEntitiesInvalidUser() throws Throwable {

        try {
            List<String> actualEntities = authorizationService.getOrganisations("16079411314");
        } catch (AuthorizationServiceException e) {
            logger.info("Client error: {}", e.getMessage());
            Assert.assertTrue(true);
        }

    }



}
