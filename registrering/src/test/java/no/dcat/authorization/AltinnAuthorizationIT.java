package no.dcat.authorization;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

/**
 * Created by dask on 22.06.2017.
 */

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
}
