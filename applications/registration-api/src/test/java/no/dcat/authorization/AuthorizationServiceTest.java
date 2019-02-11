package no.dcat.authorization;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import no.dcat.shared.testcategories.UnitTest;
import org.junit.Before;
import org.junit.Test;
import org.junit.experimental.categories.Category;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

import java.util.List;

import static org.mockito.Mockito.*;


/**
 * Created by dask on 07.06.2017.
 */

@Category(UnitTest.class)
public class AuthorizationServiceTest {

    private static Logger logger = LoggerFactory.getLogger(AuthorizationServiceTest.class);

    private AuthorizationService authorizationService;

    @Before
    public void setup() throws Throwable {
        AuthorizationService aService = new AuthorizationService();
        aService.entityNameService = new EntityNameService();
        authorizationService = spy(aService);

        ClassPathResource example = new ClassPathResource("exampleAuthorizationEntities.json");
        ObjectMapper mapper = new ObjectMapper();
        List<Entity> response = mapper.readValue(example.getInputStream(), new TypeReference<List<Entity>>() {
        });

        doReturn(response).when(authorizationService).getAuthorizedEntities(anyString());

        authorizationService.setAuthorizedOrgformService(new AlwaysTrueAuthorizedOrgformService());

    }

    @Test
    public void testGetAuthorizedEntitiesOK() throws Throwable {

        List<Entity> actualEntities = authorizationService.getAuthorizedEntities("02084902333");

        logger.info("# of entities {}", actualEntities.size());
        for (Entity entity : actualEntities) {
            logger.info("Entity {}", entity.toString());
        }
    }

    @Test
    public void testOrganisationsOK() throws Throwable {
        List<String> organizations = authorizationService.getOrganisations("02084902333");

        for (String org : organizations) {
            logger.info("org: {}", org);
        }
    }


}
