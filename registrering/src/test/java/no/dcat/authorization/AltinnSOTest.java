package no.dcat.authorization;

import no.dcat.RegisterApplication;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

/**
 * Created by dask on 07.06.2017.
 */

// -Djavax.net.ssl.keyStore=D:/altinn/brreg.jks -Djavax.net.ssl.keyStorePassword=keystore
// -Djavax.net.debug=ssl

@Profile("develop")
@RunWith(SpringRunner.class)
@ContextConfiguration(classes = RegisterApplication.class)

public class AltinnSOTest {

    private static Logger logger = LoggerFactory.getLogger(AltinnSOTest.class);

    @Test
    public void testGet() throws Throwable {

        AuthorizationService authorizationService = new AuthorizationService();

        List<Entity> actualEntities = authorizationService.getAuthorizedEntities("02084902333");

        logger.info("# of entities {}", actualEntities.size());
        for (Entity entity : actualEntities) {
            logger.info("Entity {}", entity.toString());
        }
    }


}
